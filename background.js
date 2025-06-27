// 安全版background.js
console.log('背景脚本开始加载');

// 检查chrome.commands是否可用
try {
    if (typeof chrome !== 'undefined' && chrome.commands && typeof chrome.commands.onCommand !== 'undefined') {
        console.log('chrome.commands API可用，设置快捷键监听');
        chrome.commands.onCommand.addListener(function(command) {
            console.log('收到快捷键命令:', command);
            if (command === 'force-refresh') {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    if (tabs[0]) {
                        chrome.tabs.reload(tabs[0].id, {bypassCache: true});
                    }
                });
            }
        });
    } else {
        console.log('chrome.commands API不可用，跳过快捷键设置');
    }
} catch (error) {
    console.log('设置快捷键时出错，跳过:', error.message);
}

// 扩展安装事件
try {
    chrome.runtime.onInstalled.addListener(function(details) {
        console.log('扩展事件:', details.reason);
        if (details.reason === 'install') {
            console.log('强力刷新插件已安装');
        } else if (details.reason === 'update') {
            console.log('强力刷新插件已更新');
        }
    });
} catch (error) {
    console.log('设置安装监听器时出错:', error.message);
}

console.log('背景脚本加载完成');