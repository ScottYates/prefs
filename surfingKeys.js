const {
    aceVimMap,
    mapkey,
    unmap,
    imap,
    imapkey,
    getClickableElements,
    vmapkey,
    map,
    cmap,
    addSearchAlias,
    removeSearchAlias,
    tabOpenLink,
    readText,
    Clipboard,
    Front,
    Hints,
    Visual,
    RUNTIME
} = api;

mapkey('<Ctrl-`>', 'Kill Stickies', function() {
    document.querySelectorAll("body *").forEach(function(node) {
        if (["fixed", "sticky"].includes(getComputedStyle(node).position)) {
            node.parentNode.removeChild(node)
        }
    });
    document.querySelectorAll("html *").forEach(function(node) {
        var s = getComputedStyle(node);
        if ("hidden" === s["overflow"]) {
            node.style["overflow"] = "visible"
        }
        if ("hidden" === s["overflow-x"]) {
            node.style["overflow-x"] = "visible"
        }
        if ("hidden" === s["overflow-y"]) {
            node.style["overflow-y"] = "visible"
        }
    });
    var htmlNode = document.querySelector("html");
    htmlNode.style["overflow"] = "visible";
    htmlNode.style["overflow-x"] = "visible";
    htmlNode.style["overflow-y"] = "visible";


    var i, elements = document.querySelectorAll('body *');

    for (i = 0; i < elements.length; i++) {
      if (getComputedStyle(elements[i]).position === 'fixed') {
        elements[i].parentNode.removeChild(elements[i]);
      }
    }
});

// an example to replace `u` with `?`, click `Default mappings` to see how `u` works.
map('?', 'u');

unmap('<Ctrl-i>');
map('<Ctrl-i>', '<Alt-s>'); // toggle enabled/disable of surfingkeys for the current site
unmap('<Alt-s>');

unmap('ZZ');
unmap('<Ctrl-Alt-d>');
unmap('x');

settings.blacklistPattern = /.*mail.google.com.*|.*inbox.google.com.*|trello.com/i;
settings.smartPageBoundary = false;

// click `Save` button to make above settings to take effect.
// set theme
settings.theme = '\
.sk_theme { \
    background: #fff; \
    color: #000; \
} \
.sk_theme tbody { \
    color: #000; \
} \
.sk_theme input { \
    color: #000; \
} \
.sk_theme .url { \
    color: #555; \
} \
.sk_theme .annotation { \
    color: #555; \
} \
.sk_theme .focused { \
    background: #f0f0f0; \
}';


// Helper function to generate mapkey opts
function rid(d) { return { repeatIgnore: true, domain: d }; }

mapkey('=w',  "Lookup whois information for domain", whois,           rid());
mapkey('=d',  "Lookup dns information for domain",   dns,             rid());
mapkey('=D',  "Lookup all information for domain",   dnsVerbose,      rid());
mapkey(';se', "#11Edit Settings",                    editSettings,    rid());
mapkey(';pd', "Toggle PDF viewer from SurfingKeys",  togglePdfViewer, rid());
//mapkey('gi',  "Edit current URL with vim editor",    vimEditURL,      rid());

mapkey('\\fs', "Run fakespot on current page (Amazon, Yelp)",  fakeSpot,              rid(/(amazon\.com|yelp\.com)/i));
mapkey('\\F',  "Toggle fullscreen (YouTube)",                  ytFullscreen,          rid(/(youtube\.com)/i));
mapkey('\\F',  "Toggle fullscreen (Vimeo)",                    vimeoFullscreen,       rid(/(vimeo\.com)/i));
mapkey('\\s',  "Toggle Star (GitHub)",                         ghToggleStar,          rid(/(github\.com)/i));
mapkey('\\s',  "Toggle Star (GitLab)",                         glToggleStar,          rid(/(gitlab\.com)/i));
mapkey('\\c',  "Collapse comment (Reddit)",                    redditCollapseComment, rid(/(reddit\.com)/i));
mapkey('\\c',  "Collapse comment (HN)",                        hnCollapseComment,     rid(/(news\.ycombinator\.com)/i));
mapkey('\\v',  "Cast vote (Reddit)",                           redditVote,            rid(/(reddit\.com)/i));
mapkey('\\v',  "Cast vote (HN)",                               hnVote,                rid(/(news\.ycombinator\.com)/i));
mapkey('\\m',  "Strip highlights and ending url",              matchDotCom,           rid(/(match\.com)/i));
mapkey('\\x',  "Close the current tab",                        closeWin,              rid());


//---- Functions ----//

function closeWin() {
    window.close();
}

function matchDotCom() {
    var url = window.location.href;
    url = url.replace('/highlights','');
    url = url.replace(/\?return.*/,'');
    window.open(url, '_blank').focus();
}

function fakeSpot() {
    var url = "http://fakespot.com/analyze?url=" + window.location.href;
    window.open(url, '_blank').focus();
}

function ytFullscreen() {
    $('.ytp-fullscreen-button.ytp-button').click();
}

function vimeoFullscreen() {
    $('.fullscreen-icon').click();
}

function ghToggleStar() {
  var repo = window.location.pathname.slice(1).split("/").slice(0,2).join("/");
  var cur = $('div.starring-container > form').filter(function() {
    return $(this).css("display") === "block";
  });

  var action = "starred";
  var star = "?";
  if ($(cur).attr("class").indexOf("unstarred") === -1) {
    action = "un" + action;
    star = "?";
  }

  $(cur).find("button").click();
  Front.showBanner(star + " Repository " + repo + " " + action);
}

function glToggleStar() {
  var repo = window.location.pathname.slice(1).split("/").slice(0,2).join("/");
  var action = $('.btn.star-btn > span').click().text().toLowerCase() + "red";
  var star = "?";
  if (action === "starred") {
    star = "?";
  }
  Front.showBanner(star + " Repository " + repo + " " + action);
}

function vimEditURL() {
    Front.showEditor(window.location.href, function(data) {
        window.location.href = data;
    }, 'url');
}

function whois() {
    var url = "http://centralops.net/co/DomainDossier.aspx?dom_whois=true&addr=" + window.location.hostname;
    window.open(url, '_blank').focus();
}

function dns() {
    var url = "http://centralops.net/co/DomainDossier.aspx?dom_dns=true&addr=" + window.location.hostname;
    window.open(url, '_blank').focus();
}

function dnsVerbose() {
    var url = "http://centralops.net/co/DomainDossier.aspx?dom_whois=true&dom_dns=true&traceroute=true&net_whois=true&svc_scan=true&addr=" + window.location.hostname;
    window.open(url, '_blank').focus();
}

function togglePdfViewer() {
    chrome.storage.local.get("noPdfViewer", function(resp) {
        if(!resp.noPdfViewer) {
            chrome.storage.local.set({"noPdfViewer": 1}, function() {
                Front.showBanner("PDF viewer disabled.");
            });
        } else {
            chrome.storage.local.remove("noPdfViewer", function() {
                Front.showBanner("PDF viewer enabled.");
            });
        }
    });
}

function editSettings() {
    tabOpenLink("/pages/options.html");
}

function redditCollapseComment() {
    Hints.create('a.expand', Hints.dispatchMouseClick);
}

function hnCollapseComment() {
    Hints.create('a.togg', Hints.dispatchMouseClick);
}

function redditVote() {
    Hints.create('div.arrow', Hints.dispatchMouseClick);
}

function hnVote() {
    Hints.create('div.votearrow', Hints.dispatchMouseClick);
}
