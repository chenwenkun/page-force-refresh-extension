document.addEventListener('DOMContentLoaded', function() {
    const forceRefreshBtn = document.getElementById('forceRefresh');
    const clearAllRefreshBtn = document.getElementById('clearAllRefresh');
    const successMessage = document.getElementById('successMessage');
    
    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.classList.add('show');
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 3000);
    }
    
    function setButtonLoading(button, loading) {
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
            button.style.color = 'transparent';
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            button.style.color = 'white';
        }
    }
    
    // 普通强制刷新（保持不变）
    forceRefreshBtn.addEventListener('click', async function() {
        console.log('=== 普通强制刷新 ===');
        setButtonLoading(forceRefreshBtn, true);
        showSuccess('正在强制刷新页面...');
        
        try {
            const tabs = await new Promise((resolve, reject) => {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
                    else resolve(tabs);
                });
            });
            
            if (tabs[0]) {
                chrome.tabs.reload(tabs[0].id, {bypassCache: true});
                showSuccess('刷新成功！');
                setTimeout(() => window.close(), 600);
            }
        } catch (error) {
            setButtonLoading(forceRefreshBtn, false);
            showSuccess('刷新失败: ' + error.message);
        }
    });
    
    // 优化的完全清除+刷新
    clearAllRefreshBtn.addEventListener('click', async function() {
        console.log('=== 优化的完全清除+刷新 ===');
        const startTime = Date.now();
        
        setButtonLoading(clearAllRefreshBtn, true);
        showSuccess('正在快速清除缓存...');
        
        try {
            const tabs = await new Promise((resolve, reject) => {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
                    else resolve(tabs);
                });
            });
            
            if (!tabs[0]) {
                throw new Error('找不到当前标签页');
            }
            
            const currentUrl = tabs[0].url;
            console.log('当前页面:', currentUrl);
            
            let origin = null;
            try {
                origin = new URL(currentUrl).origin;
                console.log('目标域名:', origin);
            } catch (e) {
                console.log('URL解析失败');
            }
            
            // 方案A：分步清除（推荐）
            console.log('开始分步快速清除');
            
            // 第1步：先清除最重要的缓存（最快）
            await new Promise((resolve) => {
                chrome.browsingData.remove({
                    "origins": origin ? [origin] : undefined
                }, {
                    "cache": true,           // HTTP缓存
                    "localStorage": true     // 本地存储
                }, function() {
                    console.log('核心缓存清除完成');
                    resolve();
                });
            });
            
            // 第2步：立即开始刷新（不等待其他清除完成）
            showSuccess('核心缓存已清除，正在刷新...');
            chrome.tabs.reload(tabs[0].id, {bypassCache: true});
            
            // 第3步：后台继续清除其他数据（不阻塞刷新）
            chrome.browsingData.remove({
                "origins": origin ? [origin] : undefined
            }, {
                "cookies": true,
                "indexedDB": true,
                "cacheStorage": true
            }, function() {
                console.log('其他缓存清除完成');
            });
            
            const endTime = Date.now();
            console.log(`操作总耗时: ${endTime - startTime}ms`);
            
            showSuccess('✅ 操作完成！');
            setTimeout(() => window.close(), 800);
            
        } catch (error) {
            console.error('优化清除失败:', error);
            setButtonLoading(clearAllRefreshBtn, false);
            showSuccess('操作失败，尝试普通刷新...');
            
            // 兜底：直接普通刷新
            setTimeout(() => {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    if (tabs[0]) {
                        chrome.tabs.reload(tabs[0].id, {bypassCache: true});
                        setTimeout(() => window.close(), 500);
                    }
                });
            }, 500);
        }
    });
    
    // 检查当前页面
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
            const url = tabs[0].url;
            if (url.startsWith('chrome://') || 
                url.startsWith('chrome-extension://') || 
                url.startsWith('moz-extension://') ||
                url.startsWith('about:') ||
                url.startsWith('edge://')) {
                
                forceRefreshBtn.disabled = true;
                clearAllRefreshBtn.disabled = true;
                forceRefreshBtn.textContent = '⚠️ 无法刷新此页面';
                clearAllRefreshBtn.textContent = '⚠️ 无法清除此页面';
                forceRefreshBtn.style.backgroundColor = '#ccc';
                clearAllRefreshBtn.style.backgroundColor = '#ccc';
                showSuccess('当前页面不支持刷新操作');
            }
        }
    });
});