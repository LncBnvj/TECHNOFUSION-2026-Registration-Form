const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwb6obRhpYV1dcniRPXDvOnaaty8FUAarxa682wW2MSaegkkIWr_2zJ5sVvhp2pZeBL/exec';

const competitions = {
    "Academics": ["Technology Quiz Challenge", "SQL Speed Challenge", "Networking Challenge", "Business Intelligence Dashboard Challenge", "Programming Challenge", "UI/UX Redesign Challenge - Tournament", "Technofusion Hackathon Challenge", "Robotics Techathlon Challenge", "Capture the Flag Challenge", "InterCICSkwela Programming", "InterCICSkwela Hackathon"],
    "Literary": ["Science-Technology Writing", "Poem Writing Challenge", "Reverse Poetry Challenge", "Extemporaneous Speaking Challenge", "Oratorical Speech Challenge", "Malikhaing Pagpapakilala", "Essay Writing Challenge"],
    "Performing": ["Battle of the Bands", "Modern Dance", "Runway Challenge"],
    "Visual": ["Photography Challenge", "Motion Graphics and Animation Challenge", "Digital Art Challenge", "Content Creation Challenge", "Logo Creation Challenge"],
    "Socio": ["Karsada't Kapatiran", "Pamilihang Batan"],
    "Esports": ["Valorant", "Mobile Legends: Bang Bang", "Call of Duty", "League of Legends", "Tetris", "Typing Sprint Challenge"]
};

function updateEvents() {
    const category = document.getElementById('category').value;
    const eventSelect = document.getElementById('event');
    
    eventSelect.innerHTML = '<option value="">Select Competition</option>';
    
    if (category) {
        eventSelect.disabled = false;
        competitions[category].forEach(item => {
            const opt = document.createElement('option');
            opt.value = item;
            opt.textContent = item;
            eventSelect.appendChild(opt);
        });
    } else {
        eventSelect.disabled = true;
    }
}

function changeTeamColor() {
    const team = document.getElementById('team').value;
    const root = document.querySelector(':root');
    
    // Color Map for the Teams
    const teamColors = {
        "ADLAW": "#fa0000ff",      
        "BAGANI": "#ff9900ff",     
        "TALA": "#fbff00ff",
        "BAYBAY": "#2ECC71", 
        "BULAN": "#0400ffff",      
        "SIGWA": "#8d00b8ff",      
        "DALISAY": "#ff00b3ff",   
        "ANINO": "#643000ff"       
    };

    if (teamColors[team]) {
        root.style.setProperty('--team-bg', teamColors[team]);
        root.style.setProperty('--primary', teamColors[team]);
    } else {
        root.style.setProperty('--team-bg', '#f8fafc'); // Default
        root.style.setProperty('--primary', '#2563eb');
    }
}

document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = document.getElementById('submitBtn');
    const status = document.getElementById('statusMessage');
    
    btn.disabled = true;
    btn.textContent = "Processing...";
    status.style.display = "none";

    // Create simple data object to send
    const formData = new FormData(this);

    fetch(SCRIPT_URL, { 
        method: 'POST', 
        mode: 'no-cors',
        body: formData
    })
    .then(res => {
        status.style.display = "block";
        status.className = "success";
        status.textContent = "Registration Submitted! Please check the sheet.";
        this.reset();
        document.getElementById('event').disabled = true;
    })
    .catch(err => {
        status.style.display = "block";
        status.className = "error";
        status.textContent = "Error: Submission failed. Check console for details.";
        console.error("Submission Error:", err);
    })
    .finally(() => {
        btn.disabled = false;
        btn.textContent = "Submit Registration";
    });
});