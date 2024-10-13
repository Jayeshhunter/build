chrome.runtime?.onInstalled.addListener(() => {
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1, 2, 3, 4, 5]  // Remove old rules if they exist
    });

    chrome.storage?.sync.get("redirectRules", (data) => {
        if (data.redirectRules) {
            let newRule = [];
            let ruleId = 1;
            for (let rule of data.redirectRules) {
                if (rule.enabled) {
                    newRule.push({
                        "id": ruleId++,
                        "priority": 1,
                        "action": { "type": "redirect", "redirect": { "url": rule.destinationURL } },
                        "condition": {
                            "urlFilter": rule.sourceURL, // Match source URL
                            "resourceTypes": ["main_frame"]
                        }
                    });
                }
            }
            chrome.declarativeNetRequest.updateDynamicRules({
                addRules: newRule
            });
        }
    });
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.redirectRules) {
        // Update rules dynamically when storage changes
        const updatedRules = changes.redirectRules.newValue;
        let newRules = [];
        let ruleId = 1;

        for (let rule of updatedRules) {
            if (rule.enabled) {
                newRules.push({
                    "id": ruleId++,
                    "priority": 1,
                    "action": { "type": "redirect", "redirect": { "url": rule.destinationURL } },
                    "condition": {
                        "urlFilter": rule.sourceURL,
                        "resourceTypes": ["main_frame"]
                    }
                });
            }
        }

        // Clear and update rules dynamically
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [1, 2, 3, 4, 5],  // Remove old rules
            addRules: newRules               // Add updated rules
        });
    }
});
