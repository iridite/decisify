import React from "react";
import { Database, Zap, TestTube } from "lucide-react";

/**
 * DataSourceBadge - 数据来源标识组件
 * 用于标注数据是真实API、模拟数据还是Demo数据
 */
const DataSourceBadge = ({ type, source, className = "" }) => {
  const getBadgeConfig = () => {
    switch (type) {
      case "REAL":
        return {
          icon: Database,
          label: "实时数据",
          bgColor: "bg-green-500/10",
          textColor: "text-green-400",
          borderColor: "border-green-500/30",
          description: `来自 ${source}`,
        };
      case "SIMULATED":
        return {
          icon: Zap,
          label: "模拟数据",
          bgColor: "bg-yellow-500/10",
          textColor: "text-yellow-400",
          borderColor: "border-yellow-500/30",
          description: `基于 ${source} 算法生成`,
        };
      case "DEMO":
      default:
        return {
          icon: TestTube,
          label: "演示数据",
          bgColor: "bg-blue-500/10",
          textColor: "text-blue-400",
          borderColor: "border-blue-500/30",
          description: source || "演示模式",
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border ${config.bgColor} ${config.borderColor} ${className}`}
      title={config.description}
    >
      <Icon className={`w-3 h-3 ${config.textColor}`} />
      <span className={`text-xs font-medium ${config.textColor}`}>
        {config.label}
      </span>
    </div>
  );
};

export default DataSourceBadge;
