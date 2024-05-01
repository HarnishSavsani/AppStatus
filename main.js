/*==================== MENU SHOW Y HIDDEN ====================*/
const navMenu = document.getElementById('nav-menu'),
  navToggle = document.getElementById('nav-toggle'),
  navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.add('show-menu')
  })
}

/*===== MENU HIDDEN =====*/
if (navClose) {
  navClose.addEventListener('click', () => {
    navMenu.classList.remove('show-menu')
  })
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction() {
  const navMenu = document.getElementById('nav-menu')
  navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SERVICES MODAL ====================*/
const modalViews = document.querySelectorAll('.services__modal'),
  modalBtns = document.querySelectorAll('.services__button'),
  modalCloses = document.querySelectorAll('.services__modal-close')

let modal = function (modalClick) {
  modalViews[modalClick].classList.add('active-modal')
}

modalBtns.forEach((modalBtn, i) => {
  modalBtn.addEventListener('click', () => {
    modal(i)
  })
})

modalCloses.forEach((modalClose) => {
  modalClose.addEventListener('click', () => {
    modalViews.forEach((modalView) => {
      modalView.classList.remove('active-modal')
    })
  })
})

/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader() {
  const nav = document.getElementById('header')
  if (this.scrollY >= 80) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*==================== SHOW SCROLL UP ====================*/
function scrollUp() {
  const scrollUp = document.getElementById('scroll-up');
  if (this.scrollY >= 560) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*==================== PROCESS TABS ====================*/
const tabs = document.querySelectorAll('[data-target]'),
  tabContents = document.querySelectorAll('[data-content]')

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    console.log('click disparado')
    const target = document.querySelector(tab.dataset.target)

    tabContents.forEach(tabContent => {
      tabContent.classList.remove('process__active')
    })
    target.classList.add('process__active')

    tabs.forEach(tab => {
      tab.classList.remove('process__active')
    })
    tab.classList.add('process__active')
  })
})

/*==================== ACCORDION FAQS ====================*/
const faqsContent = document.getElementsByClassName('faqs__content'),
  faqsHeader = document.querySelectorAll('.faqs__header')

function togglefaqs() {
  let itemClass = this.parentNode.className

  for (i = 0; i < faqsContent.length; i++) {
    faqsContent[i].className = 'faqs__content faqs__close'
  }
  if (itemClass === 'faqs__content faqs__close') {
    this.parentNode.className = 'faqs__content faqs_open'
  }
}

faqsHeader.forEach((el) => {
  el.addEventListener('click', togglefaqs)
})



/*==================== DARK LIGHT THEME ====================*/

const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'uil-sun'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'uil-moon' : 'uil-sun'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'uil-moon' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
  // Add or remove the dark / icon theme
  document.body.classList.toggle(darkTheme)
  themeButton.classList.toggle(iconTheme)
  // We save the theme and the current icon that the user chose
  localStorage.setItem('selected-theme', getCurrentTheme())
  localStorage.setItem('selected-icon', getCurrentIcon())
})

/*==================== Page Details loading script ====================*/
const jsonFileUrl = "app_url_check.json"; // Local file path
fetch(jsonFileUrl)
.then(function(response){
    if (!response.ok) {
        console.log('Network response was not ok');
    }
    return response.json();
})
.then(function(appstatus){
    let placeholder = document.querySelector("#data-output");
    let out = "";

    let appsCount = appstatus.length;
    console.log("Total Number of apps in the data file = " + appsCount);

    // Populate data for Unavailable Apps first
    let tempOut = "<div class=\"services__container container grid\">";
    let unavlAppCount = 0;
    for(let app of appstatus){        
        if(app.status == "Unavailable"){
            tempOut += `
                <div class="panel-unavailable">
                    <a href="${app.URL}">${app.Application}</a>
                    <p class="last-modified-time">${app.last_verfied_time}</p>
                </div>
            `;
            unavlAppCount++;
        }
    }
    tempOut += "</div>";
    out += `
                
                <h2 class="section__title">Unavailable Apps</h2>
                <span class="section__subtitle">(${unavlAppCount}/${appsCount})</span>
            `;
    out += tempOut;
    tempOut = "";   //Reset tempOut

    // Populate data for Available Apps Next
    tempOut = "<div class=\"services__container container grid\">";
    let avlAppCount = 0;
    for(let app of appstatus){        
        if(app.status == "Available"){
            tempOut += `
                <div class="panel-available">
                    <a href="${app.URL}">${app.Application}</a>
                    <p class="last-modified-time">${app.last_verfied_time}</p>
                </div>
            `;
            avlAppCount++;
        }
    }
    tempOut += "</div>";
    out += `
                
                <h2 class="section__title" style="margin-top:1rem">Available Apps</h2>
                <span class="section__subtitle">(${avlAppCount}/${appsCount})</span>
            `;
    out += tempOut;
    tempOut = "";   //Reset tempOut

    placeholder.innerHTML = out;
})
.catch((error) => {
    console.log("Error in the data file. Please check the data file, in the path " + jsonFileUrl + ", immediately.");
    let errOut = `
            <div class=\"panel-container\">
                <div class="panel-unavailable">
                <a href="${jsonFileUrl}">Loading....</a>
                <p>Data loading in progress. If the page still shows same result for long time, please check the data file in ${jsonFileUrl}.</p>
            </div>
    `;
    document.querySelector("#data-output").innerHTML = errOut;
});

/*=====================================Smooth Scrolling Website ==========================================*/
// Smooth scroll function
function smoothScroll() {
  const scrollStep = 1; // Adjust the scroll speed as needed
  const scrollInterval = setInterval(() => {
    window.scrollBy({
      top: scrollStep,
      behavior: 'smooth'
    });

    // Stop scrolling when reaching the bottom of the page
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      clearInterval(scrollInterval);
      scrollToTop(); // Call scrollToTop() here
    }
  }, 1); // Scroll every 1 millisecond (adjust as needed)
}

// Start smooth scrolling when the page loads
window.addEventListener('load', smoothScroll);

// Scroll to top function
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  
  // Restart smooth scrolling after scrolling to top
  setTimeout(() => {
    smoothScroll();
  }, 1000); // Wait for scrolling to top to complete before restarting
}
