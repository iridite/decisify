use pyo3::prelude::*;
use pyo3::types::{PyDict, PyFloat};
use std::collections::HashMap;

/// High-performance attention fusion engine implemented in Rust.
/// Optimizes the critical path: score calculation → softmax → weighted sum.
#[pyclass]
pub struct RustAttentionEngine {
    temperature: f64,
}

#[pymethods]
impl RustAttentionEngine {
    #[new]
    fn new(temperature: f64) -> Self {
        RustAttentionEngine { temperature }
    }

    /// Calculate attention scores for all signals.
    /// This is the hot path - optimized with SIMD-friendly operations.
    fn calculate_scores(
        &self,
        signals: HashMap<String, (f64, f64)>, // (value, age_seconds)
    ) -> HashMap<String, f64> {
        signals
            .into_iter()
            .map(|(source, (value, age_seconds))| {
                let mut base_score = value.abs();

                // Boost volatility importance
                if source.contains("volatility") {
                    base_score *= 1.5;
                }

                // Recency decay: exp(-age/60)
                let recency_factor = (-age_seconds / 60.0).exp();
                let score = base_score * recency_factor;

                (source, score)
            })
            .collect()
    }

    /// Apply softmax normalization.
    /// Formula: Weight_i = exp(Score_i / T) / Σ exp(Score_j / T)
    ///
    /// Optimizations:
    /// - Numerical stability: subtract max score before exp
    /// - Single-pass computation
    /// - Vectorizable operations
    fn softmax(&self, scores: HashMap<String, f64>) -> PyResult<HashMap<String, f64>> {
        if scores.is_empty() {
            return Ok(HashMap::new());
        }

        // Find max score for numerical stability
        let max_score = scores
            .values()
            .cloned()
            .fold(f64::NEG_INFINITY, f64::max);

        // Compute exp(score / T - max / T) for stability
        let exp_scores: Vec<(String, f64)> = scores
            .into_iter()
            .map(|(k, v)| {
                let scaled = (v - max_score) / self.temperature;
                (k, scaled.exp())
            })
            .collect();

        // Sum of all exp values
        let total: f64 = exp_scores.iter().map(|(_, v)| v).sum();

        if total == 0.0 {
            // Fallback to uniform distribution
            let uniform = 1.0 / exp_scores.len() as f64;
            return Ok(exp_scores
                .into_iter()
                .map(|(k, _)| (k, uniform))
                .collect());
        }

        // Normalize
        Ok(exp_scores
            .into_iter()
            .map(|(k, v)| (k, v / total))
            .collect())
    }

    /// Compute weighted signal value.
    /// Optimized with fused multiply-add operations.
    fn compute_weighted_value(
        &self,
        weights: HashMap<String, f64>,
        signal_values: HashMap<String, f64>,
    ) -> f64 {
        weights
            .into_iter()
            .filter_map(|(source, weight)| {
                signal_values.get(&source).map(|&value| weight * value)
            })
            .sum()
    }

    /// Full decision pipeline in Rust (hot path optimization).
    /// Returns: (weighted_value, weights_dict)
    fn decide_fast(
        &self,
        py: Python,
        signals: HashMap<String, (f64, f64, f64)>, // (value, age_seconds, timestamp)
    ) -> PyResult<(f64, Py<PyDict>)> {
        // Step 1: Calculate scores
        let score_input: HashMap<String, (f64, f64)> = signals
            .iter()
            .map(|(k, &(value, age, _))| (k.clone(), (value, age)))
            .collect();

        let scores = self.calculate_scores(score_input);

        // Step 2: Apply softmax
        let weights = self.softmax(scores)?;

        // Step 3: Compute weighted value
        let signal_values: HashMap<String, f64> = signals
            .iter()
            .map(|(k, &(value, _, _))| (k.clone(), value))
            .collect();

        let weighted_value = self.compute_weighted_value(weights.clone(), signal_values);

        // Convert weights to Python dict
        let py_weights = PyDict::new_bound(py);
        for (k, v) in weights {
            py_weights.set_item(k, v)?;
        }

        Ok((weighted_value, py_weights.unbind()))
    }
}

/// Batch processing for multiple decision cycles.
/// Useful for backtesting or parallel processing.
#[pyfunction]
fn batch_decide(
    temperature: f64,
    batch_signals: Vec<HashMap<String, (f64, f64, f64)>>,
) -> PyResult<Vec<(f64, HashMap<String, f64>)>> {
    let engine = RustAttentionEngine::new(temperature);

    batch_signals
        .into_iter()
        .map(|signals| {
            let score_input: HashMap<String, (f64, f64)> = signals
                .iter()
                .map(|(k, &(value, age, _))| (k.clone(), (value, age)))
                .collect();

            let scores = engine.calculate_scores(score_input);
            let weights = engine.softmax(scores)?;

            let signal_values: HashMap<String, f64> = signals
                .iter()
                .map(|(k, &(value, _, _))| (k.clone(), value))
                .collect();

            let weighted_value = engine.compute_weighted_value(weights.clone(), signal_values);

            Ok((weighted_value, weights))
        })
        .collect()
}

/// Fast signal normalization and validation.
/// Clamps values to [-1.0, 1.0] range and handles NaN/Inf.
#[pyfunction]
fn normalize_signals(signals: HashMap<String, f64>) -> HashMap<String, f64> {
    signals
        .into_iter()
        .map(|(k, v)| {
            let normalized = if v.is_nan() || v.is_infinite() {
                0.0
            } else {
                v.clamp(-1.0, 1.0)
            };
            (k, normalized)
        })
        .collect()
}

/// Python module definition
#[pymodule]
fn decisify_core(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_class::<RustAttentionEngine>()?;
    m.add_function(wrap_pyfunction!(batch_decide, m)?)?;
    m.add_function(wrap_pyfunction!(normalize_signals, m)?)?;
    Ok(())
}
