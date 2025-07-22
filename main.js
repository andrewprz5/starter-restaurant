const now = new Date();
const hour = now.getHours();
const minute = now.getMinutes();
const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
const statusText = document.querySelector('.open-status');

// Determine today's hours
let openHour, openMinute, closeHour, closeMinute;

if (day === 0) { // Sunday
    openHour = 9;
    openMinute = 0;
    closeHour = 15;
    closeMinute = 0;
} else {
    openHour = 6;
    openMinute = 0;
    closeHour = 20;
    closeMinute = 0;
}

// Helper to format time
function formatTime(hour, minute) {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hr = hour % 12 || 12;
    const min = minute.toString().padStart(2, '0');
    return `${hr}:${min} ${ampm}`;
}

// Compare current time to today's open/close
const afterOpen = hour > openHour || (hour === openHour && minute >= openMinute);
const beforeClose = hour < closeHour || (hour === closeHour && minute <= closeMinute);

if (afterOpen && beforeClose) {
    const closingTime = formatTime(closeHour, closeMinute);
    statusText.textContent = `Open Now – Closes at ${closingTime}`;
} else if (!afterOpen) {
    // Before today's opening
    const openingTime = formatTime(openHour, openMinute);
    statusText.textContent = `Closed – Opens today at ${openingTime}`;
} else {
    // After today's closing – find next open day
    let nextDay = (day + 1) % 7;
    let daysAhead = 1;

    while (true) {
        const isSunday = nextDay === 0;
        const nextOpenHour = isSunday ? 6 : 6;
        const nextOpenMinute = isSunday ? 0 : 0;

        // Found the next valid open day
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const nextOpenTime = formatTime(nextOpenHour, nextOpenMinute);
        const nextDayName = daysAhead === 1 ? 'tomorrow' : dayNames[nextDay];

        statusText.textContent = `Closed – Opens ${nextDayName} at ${nextOpenTime}`;
        break;
    }
}

// Update Menu with JSON data

fetch('menu.json')
  .then(response => {
    if (!response.ok) throw new Error("Menu file not found");
    return response.json();
  })
  .then(flatMenu => {
    // Group items by category
    const groupedMenu = flatMenu.reduce((acc, item) => {
      const category = item.Category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});

    const menuData = Object.keys(groupedMenu).map(category => ({
      category,
      items: groupedMenu[category]
    }));

    const tabsContainer = document.getElementById('category-tabs');
    const menuContainer = document.getElementById('menu-container');

    // Create tabs buttons
    menuData.forEach((section, index) => {
      const tabBtn = document.createElement('button');
      tabBtn.textContent = section.category;
      tabBtn.className = 'tab-btn';
      if (index === 0) tabBtn.classList.add('active');  // first tab active by default

      tabBtn.addEventListener('click', () => {
        // Remove active class from all buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        tabBtn.classList.add('active');

        // Render the selected category menu items
        renderMenuItems(section.items);
      });

      tabsContainer.appendChild(tabBtn);
    });

    // Function to render items for the selected category
    function renderMenuItems(items) {
      menuContainer.innerHTML = ''; // clear existing
      items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item';
        itemDiv.innerHTML = `
          <strong>${item.Name}</strong> - ${item.Price}<br>
          <small>${item.Description || ''}</small>
        `;
        menuContainer.appendChild(itemDiv);
      });
    }

    // Render the first category by default
    renderMenuItems(menuData[0].items);

  })
  .catch(error => {
    document.getElementById("menu-container").innerText = "Unable to load menu.";
    console.error("Error loading menu:", error);
  });

// Hamburger menu toggle
document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
});


// Uncomment the following code block to enable testimonials and contact form functionality
/*
// testimonials

    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial');

    function showTestimonial(index) {
        testimonials.forEach((t, i) => {
            t.classList.toggle('active', i === index);
        });
    }

    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }

    function prevTestimonial() {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonial);
    }

    setInterval(nextTestimonial, 7000);
    


const form = document.querySelector("form");
const toast = document.getElementById("toast");

  form.addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form action
    const data = new FormData(form);
    const response = await fetch(form.action, {
      method: form.method,
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      form.reset();
      toast.innerText = "Order submitted successfully!";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 3000);
    } else {
      toast.innerText = "Something went wrong. Please try again.";
      toast.classList.add("show", "error");
      setTimeout(() => toast.classList.remove("show", "error"), 3000);
    }
  });
  */
 