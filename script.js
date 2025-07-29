class BirthdayCountdown {
    constructor() {
        this.targetDate = new Date('2024-08-02T00:00:00');
        this.currentYear = new Date().getFullYear();
        this.nextBirthday = this.getNextBirthday();
        this.birthYear = 1994; // Birth year August 2, 1994
        
        this.elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            message: document.getElementById('message'),
            messageText: document.querySelector('.message-text'),
            progressCircle: document.getElementById('progressCircle'),
            progressPercentage: document.getElementById('progressPercentage'),
            targetDate: document.getElementById('targetDate'),
            ageValue: document.getElementById('ageValue'),
            currentTime: document.getElementById('currentTime'),
            celebration: document.getElementById('celebration'),
            birthdaySound: document.getElementById('birthdaySound')
        };
        
        this.init();
    }
    
    init() {
        this.updateTargetDate();
        this.updateAge();
        this.startCountdown();
        this.createStars();
        this.addEventListeners();
    }
    
    getNextBirthday() {
        const now = new Date();
        const thisYear = now.getFullYear();
        let birthday = new Date(thisYear, 7, 2); // August 2nd (month is 0-indexed)
        
        if (birthday < now) {
            birthday = new Date(thisYear + 1, 7, 2);
        }
        
        return birthday;
    }
    
    updateTargetDate() {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        this.elements.targetDate.textContent = this.nextBirthday.toLocaleDateString('en-US', options);
    }
    
    updateAge() {
        const age = this.nextBirthday.getFullYear() - this.birthYear;
        this.elements.ageValue.textContent = `${age} Years Old`;
    }
    
    startCountdown() {
        this.updateCountdown();
        setInterval(() => {
            this.updateCountdown();
        }, 1000);
        
        // Update current time
        setInterval(() => {
            this.updateCurrentTime();
        }, 1000);
    }
    
    updateCountdown() {
        const now = new Date().getTime();
        const distance = this.nextBirthday.getTime() - now;
        
        if (distance < 0) {
            this.showBirthdayMessage();
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        this.elements.days.textContent = String(days).padStart(3, '0');
        this.elements.hours.textContent = String(hours).padStart(2, '0');
        this.elements.minutes.textContent = String(minutes).padStart(2, '0');
        this.elements.seconds.textContent = String(seconds).padStart(2, '0');
        
        this.updateProgress(distance);
        this.updateMessage(days, hours, minutes, seconds);
    }
    
    updateProgress(distance) {
        const totalYear = 365 * 24 * 60 * 60 * 1000; // milliseconds in a year
        const yearStart = new Date(this.currentYear, 0, 1).getTime();
        const yearEnd = new Date(this.currentYear + 1, 0, 1).getTime();
        const yearProgress = (Date.now() - yearStart) / (yearEnd - yearStart);
        
        const circumference = 2 * Math.PI * 90;
        const offset = circumference - (yearProgress * circumference);
        
        this.elements.progressCircle.style.strokeDashoffset = offset;
        this.elements.progressPercentage.textContent = `${Math.round(yearProgress * 100)}%`;
    }
    
    updateMessage(days, hours, minutes, seconds) {
        let message = '';
        let icon = '🌟';
        
        if (days === 0 && hours === 0 && minutes === 0) {
            message = `🎉 HAPPY BIRTHDAY! 🎉`;
            icon = '🎂';
        } else if (days === 0) {
            message = `Today is the day! ${hours}h ${minutes}m ${seconds}s left!`;
            icon = '🎈';
        } else if (days === 1) {
            message = `Tomorrow is your special day!`;
            icon = '🎁';
        } else if (days <= 7) {
            message = `Less than a week to go! ${days} days left!`;
            icon = '⭐';
        } else if (days <= 30) {
            message = `Getting closer! ${days} days to go!`;
            icon = '🌟';
        } else if (days <= 100) {
            message = `${days} days until your special day!`;
            icon = '✨';
        } else {
            message = `${days} days of anticipation ahead!`;
            icon = '🌟';
        }
        
        this.elements.messageText.textContent = message;
        document.querySelector('.message-icon').textContent = icon;
    }
    
    updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        this.elements.currentTime.textContent = timeString;
    }
    
    showBirthdayMessage() {
        this.elements.days.textContent = '000';
        this.elements.hours.textContent = '00';
        this.elements.minutes.textContent = '00';
        this.elements.seconds.textContent = '00';
        
        this.elements.messageText.textContent = '🎉 HAPPY BIRTHDAY! 🎉';
        document.querySelector('.message-icon').textContent = '🎂';
        
        this.startCelebration();
    }
    
    startCelebration() {
        this.elements.celebration.classList.add('active');
        
        // Play birthday sound
        this.elements.birthdaySound.play().catch(e => console.log('Audio play failed:', e));
        
        // Create confetti
        this.createConfetti();
        
        // Hide celebration after 10 seconds
        setTimeout(() => {
            this.elements.celebration.classList.remove('active');
        }, 10000);
    }
    
    createConfetti() {
        const colors = ['#ff6b6b', '#4ecdc4', '#feca57', '#ff9ff3', '#54a0ff'];
        
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'absolute';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.top = '-10px';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = '50%';
                confetti.style.animation = `confettiFall ${2 + Math.random() * 3}s linear forwards`;
                
                this.elements.celebration.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 5000);
            }, i * 50);
        }
    }
    
    createStars() {
        const starsContainer = document.querySelector('.stars');
        const numStars = 200;
        
        for (let i = 0; i < numStars; i++) {
            const star = document.createElement('div');
            star.style.position = 'absolute';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.width = Math.random() * 3 + 1 + 'px';
            star.style.height = star.style.width;
            star.style.backgroundColor = '#fff';
            star.style.borderRadius = '50%';
            star.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px rgba(255,255,255,0.8)`;
            star.style.animation = `sparkle ${Math.random() * 3 + 2}s linear infinite`;
            star.style.animationDelay = Math.random() * 3 + 's';
            
            starsContainer.appendChild(star);
        }
    }
    
    addEventListeners() {
        // Add click event to celebration elements for interaction
        document.addEventListener('click', (e) => {
            if (e.target.closest('.countdown-card')) {
                this.createClickEffect(e.clientX, e.clientY);
            }
        });
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                e.preventDefault();
                this.createRandomEffect();
            }
        });
    }
    
    createClickEffect(x, y) {
        const effect = document.createElement('div');
        effect.style.position = 'fixed';
        effect.style.left = x + 'px';
        effect.style.top = y + 'px';
        effect.style.width = '20px';
        effect.style.height = '20px';
        effect.style.background = 'radial-gradient(circle, #4ecdc4, transparent)';
        effect.style.borderRadius = '50%';
        effect.style.pointerEvents = 'none';
        effect.style.animation = 'pulse 0.6s ease-out forwards';
        effect.style.zIndex = '1000';
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 600);
    }
    
    createRandomEffect() {
        const effects = ['✨', '🌟', '⭐', '💫', '🎈', '🎉'];
        const effect = document.createElement('div');
        effect.textContent = effects[Math.floor(Math.random() * effects.length)];
        effect.style.position = 'fixed';
        effect.style.left = Math.random() * window.innerWidth + 'px';
        effect.style.top = Math.random() * window.innerHeight + 'px';
        effect.style.fontSize = '2rem';
        effect.style.pointerEvents = 'none';
        effect.style.animation = 'fadeInUp 1s ease-out forwards';
        effect.style.zIndex = '1000';
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 1000);
    }
}

// Initialize the countdown when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BirthdayCountdown();
});

// Add some extra visual effects
document.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.02) { // 2% chance on mouse move
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = e.clientX + 'px';
        sparkle.style.top = e.clientY + 'px';
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.background = '#fff';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.animation = 'sparkle 1s ease-out forwards';
        sparkle.style.zIndex = '999';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
});