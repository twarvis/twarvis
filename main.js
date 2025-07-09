// SocialAI Assistant - Main JS
class SocialAI {
  constructor() {
    this.connectedAccounts = {
      whatsapp: false,
      instagram: false
    };
    this.messageHistory = [];
    this.settings = {
      recoverDeletedMessages: true,
      autoTagMembers: true,
      autoViewStatus: true,
      autoGroupResponses: true,
      aiChatEnabled: true
    };
    this.initEventListeners();
    this.checkCompatibility();
  }

  // Initialize event listeners
  initEventListeners() {
    // Connect buttons
    document.getElementById('connect-whatsapp').addEventListener('click', () => this.connectAccount('whatsapp'));
    document.getElementById('connect-instagram').addEventListener('click', () => this.connectAccount('instagram'));
    
    // Feature toggles
    document.querySelectorAll('.feature-toggle').forEach(toggle => {
      toggle.addEventListener('change', (e) => this.toggleFeature(e.target.id, e.target.checked));
    });
    
    // Chat interface
    document.getElementById('send-message').addEventListener('click', () => this.sendUserMessage());
    document.getElementById('user-message').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendUserMessage();
    });
    
    // Settings
    document.getElementById('save-settings').addEventListener('click', () => this.saveSettings());
  }

  // Check browser/device compatibility
  checkCompatibility() {
    if (!window.navigator.onLine) {
      this.showAlert('You need to be online to use SocialAI');
    }
    
    // Check for required APIs
    if (!('indexedDB' in window)) {
      this.showAlert('Your browser doesn\'t support some required features');
    }
  }

  // Connect to social media accounts
  async connectAccount(platform) {
    try {
      this.showLoader(`Connecting to ${platform}...`);
      
      // In a real app, this would use the official API
      // For demo, we simulate connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      this.connectedAccounts[platform] = true;
      this.updateConnectionStatus();
      this.showAlert(`Successfully connected to ${platform}!`);
      
      if (platform === 'whatsapp') {
        this.setupWhatsAppFeatures();
      } else {
        this.setupInstagramFeatures();
      }
    } catch (error) {
      this.showAlert(`Failed to connect to ${platform}: ${error.message}`);
    } finally {
      this.hideLoader();
    }
  }

  // Setup WhatsApp specific features
  setupWhatsAppFeatures() {
    if (this.settings.recoverDeletedMessages) {
      this.startMessageRecovery();
    }
    
    if (this.settings.autoGroupResponses) {
      this.enableGroupAutoResponses();
    }
    
    if (this.settings.autoViewStatus) {
      this.enableAutoStatusViewing();
    }
  }

  // Setup Instagram specific features
  setupInstagramFeatures() {
    if (this.settings.autoTagMembers) {
      this.enableAutoTagging();
    }
  }

  // Recover deleted WhatsApp messages
  async startMessageRecovery() {
    try {
      this.showLoader('Scanning for deleted messages...');
      
      // Simulate finding deleted messages
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would interface with local storage/database
      const recoveredMessages = [
        { id: 1, from: 'John', message: 'Hey, are we still meeting tomorrow?', timestamp: '2025-03-15T10:30:00' },
        { id: 2, from: 'Group: Friends', message: 'Alice: The party starts at 8pm', timestamp: '2025-03-14T19:45:00' }
      ];
      
      this.displayRecoveredMessages(recoveredMessages);
      this.showAlert(`Recovered ${recoveredMessages.length} deleted messages`);
    } catch (error) {
      console.error('Message recovery failed:', error);
    } finally {
      this.hideLoader();
    }
  }

  // Display recovered messages
  displayRecoveredMessages(messages) {
    const container = document.getElementById('recovered-messages');
    container.innerHTML = '';
    
    messages.forEach(msg => {
      const msgElement = document.createElement('div');
      msgElement.className = 'recovered-message';
      msgElement.innerHTML = `
        <strong>${msg.from}</strong>
        <p>${msg.message}</p>
        <small>${new Date(msg.timestamp).toLocaleString()}</small>
      `;
      container.appendChild(msgElement);
    });
  }

  // Enable auto-responses in WhatsApp groups
  enableGroupAutoResponses() {
    // This would interface with WhatsApp Web/API in a real implementation
    console.log('Group auto-responses enabled');
    
    // Simulate receiving a group message
    setTimeout(() => {
      this.simulateGroupMessage({
        group: 'Family Chat',
        sender: 'Mom',
        message: 'When are you coming home?'
      });
    }, 3000);
  }

  // Simulate receiving a group message
  simulateGroupMessage({ group, sender, message }) {
    if (!this.settings.autoGroupResponses) return;
    
    // Check if this is a message we should respond to
    const response = this.generateGroupResponse(message);
    if (response) {
      this.addChatMessage('ai', `[Group: ${group}] Automatically responding to ${sender}: "${response}"`);
      
      // In real implementation, this would send the message
      console.log(`Would send to ${group}: ${response}`);
    }
  }

  // Generate automatic group response
  generateGroupResponse(message) {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('when are you')) {
      return "I'll be there by 8pm!";
    } else if (lowerMsg.includes('where are you')) {
      return "On my way home now.";
    } else if (lowerMsg.includes('dinner') || lowerMsg.includes('food')) {
      return "I can pick up something on my way home if you'd like.";
    } else if (lowerMsg.includes('?')) {
      return "I'll check and get back to you shortly!";
    }
    
    return null;
  }

  // Enable auto-viewing of status updates
  enableAutoStatusViewing() {
    // This would interface with WhatsApp Web/API
    console.log('Auto status viewing enabled');
    
    // Simulate viewing statuses
    setInterval(() => {
      const contacts = ['John', 'Sarah', 'Mike', 'Dad'];
      const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
      console.log(`Viewed ${randomContact}'s status`);
      
      this.addChatMessage('system', `Automatically viewed ${randomContact}'s status update`);
    }, 10000);
  }

  // Enable auto-tagging on Instagram
  enableAutoTagging() {
    // This would interface with Instagram API
    console.log('Auto tagging enabled');
    
    // Simulate tagging in a post
    document.getElementById('create-post').addEventListener('click', () => {
      const members = ['@user1', '@user2', '@user3', '@user4'];
      this.addChatMessage('ai', `Automatically tagged members in new post: ${members.join(' ')}`);
    });
  }

  // Toggle features on/off
  toggleFeature(featureId, isEnabled) {
    this.settings[featureId] = isEnabled;
    console.log(`${featureId} ${isEnabled ? 'enabled' : 'disabled'}`);
    
    // Re-initialize features if needed
    if (featureId === 'recoverDeletedMessages' && isEnabled && this.connectedAccounts.whatsapp) {
      this.startMessageRecovery();
    }
  }

  // Save settings to storage
  async saveSettings() {
    try {
      // In a real app, this would save to IndexedDB or backend
      localStorage.setItem('socialAI-settings', JSON.stringify(this.settings));
      this.showAlert('Settings saved successfully!');
    } catch (error) {
      this.showAlert('Failed to save settings');
      console.error(error);
    }
  }

  // Load settings from storage
  async loadSettings() {
    try {
      const savedSettings = localStorage.getItem('socialAI-settings');
      if (savedSettings) {
        this.settings = JSON.parse(savedSettings);
        
        // Update UI toggles
        Object.entries(this.settings).forEach(([key, value]) => {
          const toggle = document.getElementById(key);
          if (toggle) toggle.checked = value;
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  // Handle user messages
  async sendUserMessage() {
    const input = document.getElementById('user-message');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    this.addChatMessage('user', message);
    input.value = '';
    
    // Process message
    if (this.settings.aiChatEnabled) {
      const response = await this.generateAIResponse(message);
      this.addChatMessage('ai', response);
    }
  }

  // Generate AI response (simulated)
  async generateAIResponse(message) {
    this.showLoader('AI is thinking...');
    
    // In a real app, this would call an AI API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowerMsg = message.toLowerCase();
    
    // Simple response logic - replace with actual AI in production
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      return "Hello there! How can I assist you today?";
    } else if (lowerMsg.includes('recover') || lowerMsg.includes('deleted')) {
      return "I can help recover deleted WhatsApp messages. Would you like me to scan for deleted messages now?";
    } else if (lowerMsg.includes('tag') || lowerMsg.includes('mention')) {
      return "Auto-tagging is enabled. I'll automatically tag relevant people in your Instagram posts.";
    } else if (lowerMsg.includes('status') || lowerMsg.includes('story')) {
      return "I'm automatically viewing status updates for you. You can check the activity log to see which ones I've viewed.";
    } else if (lowerMsg.includes('group') || lowerMsg.includes('response')) {
      return "I'm monitoring your groups for questions I can answer automatically. You can customize my responses in settings.";
    } else {
      const randomResponses = [
        "Interesting! Tell me more about that.",
        "I can help with WhatsApp and Instagram automation. What would you like to do?",
        "I'm designed to assist with social media tasks. How can I help you today?",
        "Let me know if you'd like help with message recovery, auto-tagging, or other features!"
      ];
      return randomResponses[Math.floor(Math.random() * randomResponses.length)];
    }
  }

  // Add message to chat UI
  addChatMessage(sender, message) {
    const chatContainer = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    
    messageElement.className = `chat-message ${sender}`;
    messageElement.innerHTML = `
      <div class="message-content">${message}</div>
      <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    `;
    
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // Add to message history
    this.messageHistory.push({
      sender,
      message,
      timestamp: new Date().toISOString()
    });
  }

  // Update connection status UI
  updateConnectionStatus() {
    document.getElementById('whatsapp-status').textContent = 
      this.connectedAccounts.whatsapp ? 'Connected' : 'Disconnected';
    document.getElementById('instagram-status').textContent = 
      this.connectedAccounts.instagram ? 'Connected' : 'Disconnected';
  }

  // Show loading indicator
  showLoader(message) {
    const loader = document.getElementById('loader');
    loader.textContent = message;
    loader.style.display = 'block';
  }

  // Hide loading indicator
  hideLoader() {
    document.getElementById('loader').style.display = 'none';
  }

  // Show alert message
  showAlert(message) {
    const alertBox = document.getElementById('alert-box');
    alertBox.textContent = message;
    alertBox.style.display = 'block';
    
    setTimeout(() => {
      alertBox.style.display = 'none';
    }, 3000);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const socialAI = new SocialAI();
  
  // Load saved settings
  socialAI.loadSettings();
  
  // Make available globally for demo purposes
  window.socialAI = socialAI;
});