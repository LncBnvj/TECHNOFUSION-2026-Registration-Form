const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwb6obRhpYV1dcniRPXDvOnaaty8FUAarxa682wW2MSaegkkIWr_2zJ5sVvhp2pZeBL/exec';

const competitions = {
    "Academics": ["Business Intelligence Dashboard Challenge", "UI/UX Redesign Challenge", "Capture the Flag Challenge"],
};

const teamRules = { 
    "UI/UX Redesign Challenge": { min: 3, max: 3 },
};

function updateEvents() {
    const category = document.getElementById('category').value;
    const eventSelect = document.getElementById('event');
    const teamSection = document.getElementById('teamDetailsSection');
    const container = document.getElementById('memberInputsContainer');
    
    eventSelect.innerHTML = '<option value="">Select Competition</option>';
    teamSection.style.display = "none";

    if (category && competitions[category]) {
        eventSelect.disabled = false;
        competitions[category].forEach(item => {
            const opt = document.createElement('option');
            opt.value = opt.textContent = item;
            eventSelect.appendChild(opt);
        });
    }

    eventSelect.onchange = function() {
        const selectedEvent = this.value;
        container.innerHTML = ""; 
        
        if (teamRules[selectedEvent]) {
            teamSection.style.display = "block";
            const rule = teamRules[selectedEvent];
            document.getElementById('memberLabel').textContent = 
                `Team Members (Min: ${rule.min}, Max: ${rule.max})`;

            for (let i = 1; i <= rule.max; i++) {
                const input = document.createElement('input');
                input.type = "text";
                input.placeholder = `Member ${i} ${i <= rule.min ? '(Required)' : '(Optional)'}`;
                input.className = "member-input";
                
                // Only the MINIMUM number of members are marked "required"
                if (i <= rule.min) {
                    input.required = true;
                }

                input.addEventListener('input', combineNames); 
                container.appendChild(input);
            }
        } else {
            teamSection.style.display = "none";
        }
    };
}

function combineNames() {
    const inputs = document.querySelectorAll('.member-input');
    const names = Array.from(inputs).map(input => input.value.trim()).filter(val => val !== "");
    document.getElementById('finalMembersList').value = names.join(", ");
}

// --- Team Color Logic ---
function changeTeamColor() {
    const team = document.getElementById('team').value;
    const root = document.documentElement;
    
    const teamColors = {
        "ASTRA": "#fa0000",      
        "NOVA": "#ff9900",     
        "LYRA": "#fbff00",
        "SCRIPTUM": "#2ECC71", 
        "VORTEX": "#0400ff",      
        "TITAN": "#8d00b8",      
        "FLUX": "#ff00b3",   
        "UMBRA": "#643000"       
    };

    if (teamColors[team]) {
        root.style.setProperty('--team-bg', teamColors[team] + "15"); // Adds transparency for background
        root.style.setProperty('--primary', teamColors[team]);
    }
}

document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    combineNames();

    const btn = document.getElementById('submitBtn');
    const status = document.getElementById('statusMessage');
    const email = document.getElementById('email').value;

    // --- 1. Email Validation ---
    if (!email.toLowerCase().endsWith('@g.batstate-u.edu.ph')) {
        status.style.display = "block";
        status.className = "error";
        status.textContent = "Access Denied: Please use your official Red Spartan email (@g.batstate-u.edu.ph).";
        window.scrollTo(0, document.body.scrollHeight);
        return; // Stops the function here
    }

    const formData = new FormData(this);
    
    // Debugging logs to verify your team data
    console.log("Team Name:", formData.get("Participating_Team"));
    console.log("Members:", formData.get("Members"));    

    fetch(SCRIPT_URL, { 
        method: 'POST', 
        mode: 'no-cors',
        body: formData
    })
    .then(() => {
        document.getElementById('successModal').style.display = 'flex';
        
        this.reset();
        document.getElementById('event').disabled = true;
        document.getElementById('teamDetailsSection').style.display = "none";
        
        // Reset colors
        document.documentElement.style.setProperty('--team-bg', '#f8fafc');
        document.documentElement.style.setProperty('--primary', '#2563eb');
        status.style.display = "none"; // Hide error if it was showing
    })
    .catch(err => {
        status.style.display = "block";
        status.className = "error";
        status.textContent = "Submission Error. Please check your connection.";
        console.error(err);
    })
    .finally(() => {
        btn.disabled = false;
        btn.textContent = "Submit Registration";
    });
});

function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}

// Set the deadline
const registrationDeadline = new Date(2026, 3, 25, 23, 59, 59).getTime(); 

const timerInterval = setInterval(function() {
    const now = new Date().getTime();
    const distance = registrationDeadline - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // This generates the 4 rectangular blocks on one line
    document.getElementById("timer").innerHTML = 
        `<span>${days}d</span><span>${hours}h</span><span>${minutes}m</span><span>${seconds}s</span>`;

    if (distance < 0) {
        clearInterval(timerInterval);
        document.getElementById("countdown").innerHTML = "REGISTRATION CLOSED";
    } 
}, 1000);
