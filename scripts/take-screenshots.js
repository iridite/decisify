#!/usr/bin/env node

/**
 * Decisify Screenshot Generator
 *
 * 自动截取高质量的项目截图用于黑客松提交
 *
 * 使用方法：
 * 1. 确保已安装依赖：npm install puppeteer
 * 2. 启动后端服务：python main.py
 * 3. 启动前端服务：cd dashboard && npm run dev
 * 4. 运行脚本：node scripts/take-screenshots.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  // 使用在线演示地址或本地地址
  baseUrl: process.env.DEMO_URL || 'https://iridite.github.io/decisify/',
  // baseUrl: 'http://localhost:5173',

  outputDir: path.join(__dirname, '..', 'screenshots'),

  viewport: {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 2, // 高 DPI 截图
  },

  screenshots: [
    {
      name: 'dashboard-overview',
      description: '仪表盘总览 - 展示完整的决策智能界面',
      waitTime: 3000, // 等待数据加载
      fullPage: true, // 全页面截图
    },
    {
      name: 'signal-detail',
      description: '信号详情 - 展示透明的推理过程',
      waitTime: 2000,
      fullPage: false,
    },
    {
      name: 'decision-flow',
      description: '决策流程 - 展示感知到行动的完整流程',
      waitTime: 2000,
      fullPage: false,
    },
  ],
};

// 确保输出目录存在
function ensureOutputDir() {
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    console.log(`✅ 创建输出目录: ${CONFIG.outputDir}`);
  }
}

// 等待指定时间
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 截取单个截图
async function takeScreenshot(page, config) {
  console.log(`\n📸 正在截取: ${config.name}`);
  console.log(`   描述: ${config.description}`);

  try {
    // 等待页面加载
    await page.waitForSelector('body', { timeout: 10000 });

    // 等待额外时间让数据加载
    console.log(`   ⏳ 等待 ${config.waitTime}ms 让内容加载...`);
    await sleep(config.waitTime);

    // 滚动到顶部
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(500);

    // 截图配置
    const screenshotOptions = {
      path: path.join(CONFIG.outputDir, `${config.name}.png`),
      type: 'png',
      fullPage: config.fullPage || false,
    };

    // 如果不是全页面截图，使用视口大小
    if (!config.fullPage) {
      screenshotOptions.clip = {
        x: 0,
        y: 0,
        width: CONFIG.viewport.width,
        height: CONFIG.viewport.height,
      };
    }

    // 截取截图
    await page.screenshot(screenshotOptions);

    // 获取文件大小
    const stats = fs.statSync(screenshotOptions.path);
    const fileSizeKB = (stats.size / 1024).toFixed(2);

    console.log(`   ✅ 保存成功: ${config.name}.png (${fileSizeKB} KB)`);

    return true;
  } catch (error) {
    console.error(`   ❌ 截图失败: ${error.message}`);
    return false;
  }
}

// 主函数
async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║         Decisify Screenshot Generator                     ║');
  console.log('║         高质量截图生成工具                                 ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  console.log(`🌐 目标地址: ${CONFIG.baseUrl}`);
  console.log(`📁 输出目录: ${CONFIG.outputDir}`);
  console.log(`📐 分辨率: ${CONFIG.viewport.width}x${CONFIG.viewport.height} @${CONFIG.viewport.deviceScaleFactor}x`);
  console.log(`📸 截图数量: ${CONFIG.screenshots.length}`);

  // 确保输出目录存在
  ensureOutputDir();

  let browser;
  try {
    // 启动浏览器
    console.log('\n🚀 启动浏览器...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
      ],
    });

    const page = await browser.newPage();

    // 设置视口
    await page.setViewport(CONFIG.viewport);

    // 设置用户代理
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // 访问页面
    console.log(`\n🌍 访问页面: ${CONFIG.baseUrl}`);
    await page.goto(CONFIG.baseUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    console.log('✅ 页面加载完成');

    // 截取所有截图
    let successCount = 0;
    for (const screenshotConfig of CONFIG.screenshots) {
      const success = await takeScreenshot(page, screenshotConfig);
      if (success) successCount++;

      // 截图之间稍作等待
      await sleep(1000);
    }

    // 生成 README
    await generateReadme(successCount);

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log(`║  截图完成: ${successCount}/${CONFIG.screenshots.length} 成功                              ║`);
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    console.log('📝 提示：');
    console.log('   1. 检查截图质量是否满意');
    console.log('   2. 如需重新截取，再次运行此脚本');
    console.log('   3. 截图已保存到 screenshots/ 目录');
    console.log('   4. 可以在 README.md 中使用这些截图\n');

  } catch (error) {
    console.error('\n❌ 错误:', error.message);
    console.error('\n💡 故障排除：');
    console.error('   1. 确保前端服务正在运行（npm run dev）');
    console.error('   2. 确保后端服务正在运行（python main.py）');
    console.error('   3. 检查 URL 是否正确');
    console.error('   4. 尝试使用在线演示地址\n');
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// 生成 README
async function generateReadme(successCount) {
  const readmePath = path.join(CONFIG.outputDir, 'README.md');
  const now = new Date().toISOString().split('T')[0];

  const content = `# Decisify Screenshots

This directory contains project screenshots for documentation and Hackathon submission.

## Files

${CONFIG.screenshots.map((s, i) => `
### ${i + 1}. ${s.name}.png
- **Description**: ${s.description}
- **Resolution**: ${CONFIG.viewport.width}x${CONFIG.viewport.height} @${CONFIG.viewport.deviceScaleFactor}x
- **Type**: ${s.fullPage ? 'Full page' : 'Viewport'}
`).join('\n')}

## Generation

Screenshots were automatically generated using Puppeteer:
- Date: ${now}
- Source: ${CONFIG.baseUrl}
- Resolution: ${CONFIG.viewport.width}x${CONFIG.viewport.height} @${CONFIG.viewport.deviceScaleFactor}x DPI
- Format: PNG (lossless)
- Success: ${successCount}/${CONFIG.screenshots.length}

## Usage

These screenshots are used in:
- README.md (project documentation)
- SUBMISSION.md (Hackathon submission)
- GitHub Pages (live demo documentation)

## Regeneration

To regenerate screenshots:

\`\`\`bash
# 方式 1: 使用在线演示（推荐）
node scripts/take-screenshots.js

# 方式 2: 使用本地服务
# 1. 启动后端
python main.py &

# 2. 启动前端
cd dashboard && npm run dev &

# 3. 运行脚本（使用本地地址）
DEMO_URL=http://localhost:5173 node scripts/take-screenshots.js
\`\`\`

## Tips

- 确保页面完全加载后再截图
- 使用高 DPI 设置获得清晰的截图
- 截图应展示项目的核心功能和亮点
- 保持截图文件大小合理（< 500KB）
`;

  fs.writeFileSync(readmePath, content);
  console.log(`\n📝 已生成 README: ${readmePath}`);
}

// 运行主函数
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, takeScreenshot };
