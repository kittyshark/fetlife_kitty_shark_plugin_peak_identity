console.log("I`m here")

function fetchUserIdentity(url) {
    console.log("url:", url)

    return fetch(url).then(response => response.text()).then(data => {
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(data, "text/html");
        const userProfileElement = htmlDocument.querySelector('div[data-component="UserProfile"]');
        
        if (userProfileElement) {
            const userData = JSON.parse(userProfileElement.getAttribute('data-props'));
            return userData && userData.dataCore && userData.dataCore.identity;
        }
    });
}

function addIdentityToUsernames(node = document) {
    console.log("I`m here addIdentityToUsernames")
    
    // Notice the removal of the `g` flag
    const userLinkRegex = /https:\/\/fetlife\.com\/users\/(\d+)/; 

    const x = Array.from(node.querySelectorAll('a[href^="/users/"]'))
    
    console.log("xgjdfjgidfjiogfdghfdhio:", x)

    const userLinks = x.filter(link => {
        userLinkRegex.lastIndex = 0; // Reset the lastIndex
        return userLinkRegex.test(link.href);
    });
                           
    console.log("I`m here userLinks", userLinks)
    
    userLinks.forEach(link => {
        fetchUserIdentity(link.href).then(identity => {
            if (identity) {
                link.innerText += ` (${identity})`;
            }
        });
    });
}

// Observe changes and call the function for new content
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.addedNodes) {
            mutation.addedNodes.forEach(node => {
                if (node instanceof HTMLElement) {
                    addIdentityToUsernames(node);
                }
            });
        }
    });
});

// Start observing the document with the configured parameters
observer.observe(document.body, { childList: true, subtree: true });

// Initial call
addIdentityToUsernames();
