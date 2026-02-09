var chatMessages = JSON.parse(localStorage.getItem('chatHistory')) || [];
var typingTimer;
var isTyping = false;

function initChat() {
    updateChatTime();
    loadChatHistory();
    setInterval(updateChatTime, 60000);
    updateCartCount();
    
    var userName = localStorage.getItem('chatUserName');
    if (userName) {
        document.getElementById('userName').textContent = userName;
    }
    
    setTimeout(function() {
        autoWelcome();
    }, 1000);
}

function updateChatTime() {
    var now = new Date();
    var timeString = now.toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'});
    document.getElementById('chatTime').textContent = timeString;
}

function loadChatHistory() {
    var chatContainer = document.getElementById('chatMessages');
    if (!chatContainer) return;
    
    if (chatMessages.length === 0) {
        addBotMessage('سلام! به چت پشتیبانی خوش آمدید. چگونه می‌توانم کمک کنم؟');
        return;
    }
    
    chatContainer.innerHTML = '';
    chatMessages.forEach(function(message) {
        displayMessage(message);
    });
    
    scrollToBottom();
}

function displayMessage(message) {
    var chatContainer = document.getElementById('chatMessages');
    if (!chatContainer) return;
    
    var messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + message.sender;
    
    var contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (message.sender === 'bot') {
        contentDiv.innerHTML = '<strong>پشتیبانی:</strong> ' + message.text;
    } else {
        contentDiv.innerHTML = '<strong>شما:</strong> ' + message.text;
    }
    
    var timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = message.time || new Date().toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'});
    
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timeDiv);
    
    chatContainer.appendChild(messageDiv);
    scrollToBottom();
}

function sendMessage() {
    var input = document.getElementById('messageInput');
    var text = input.value.trim();
    
    if (text === '') return;
    
    addUserMessage(text);
    input.value = '';
    
    saveChatMessage('user', text);
    
    showTypingIndicator();
    
    setTimeout(function() {
        hideTypingIndicator();
        generateBotResponse(text);
    }, 1500);
}

function sendQuickMessage(text) {
    var input = document.getElementById('messageInput');
    input.value = text;
    sendMessage();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
        event.preventDefault();
    }
}

function addUserMessage(text) {
    var message = {
        sender: 'user',
        text: text,
        time: new Date().toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'})
    };
    
    displayMessage(message);
    saveChatMessage('user', text);
}

function addBotMessage(text) {
    var message = {
        sender: 'bot',
        text: text,
        time: new Date().toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'})
    };
    
    displayMessage(message);
    saveChatMessage('bot', text);
}

function generateBotResponse(userMessage) {
    userMessage = userMessage.toLowerCase();
    var response = '';
    
    if (userMessage.includes('سلام') || userMessage.includes('درود')) {
        response = 'سلام! خوش آمدید. چه کمکی می‌توانم بکنم؟';
    } else if (userMessage.includes('قیمت') || userMessage.includes('هزینه')) {
        response = 'برای استعلام قیمت لطفا محصول مورد نظر را از بخش محصولات انتخاب کنید. قیمت‌ها به روز هستند.';
    } else if (userMessage.includes('گارانتی') || userMessage.includes('ضمانت')) {
        response = 'گارانتی محصولات ما ۱۸ ماه است. برای اطلاعات بیشتر به بخش پشتیبانی مراجعه کنید.';
} else if (userMessage.includes('زمان تحویل') || userMessage.includes('مدت ارسال')) {
        response = 'تحویل در تهران ۲۴ ساعت و شهرستان ۳-۵ روز کاری است.';
    } else if (userMessage.includes('سفارش') || userMessage.includes('خرید')) {
        response = 'برای خرید لطفا به صفحه محصول مراجعه و به سبد خرید اضافه کنید.';
    } else if (userMessage.includes('ممنون') || userMessage.includes('تشکر')) {
        response = 'خوشحالیم که توانستیم کمک کنیم! برای سوالات بیشتر در خدمتیم.';
    } else {
        var responses = [
            'متوجه شدم. لطفا بیشتر توضیح دهید.',
            'برای بررسی دقیق‌تر، لطفا شماره سفارش یا محصول خود را ذکر کنید.',
            'کارشناسان ما به زودی با شما تماس خواهند گرفت.',
            'لطفا از طریق تیکت پشتیبانی نیز این موضوع را ثبت کنید.',
            'این موضوع نیاز به بررسی تخصصی دارد. لطفا صبور باشید.'
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
    }
    
    addBotMessage(response);
}

function showTypingIndicator() {
    var chatContainer = document.getElementById('chatMessages');
    if (!chatContainer) return;
    
    var typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = 'پشتیبانی در حال تایپ است <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    
    chatContainer.appendChild(typingDiv);
    scrollToBottom();
}

function hideTypingIndicator() {
    var typingDiv = document.getElementById('typingIndicator');
    if (typingDiv) {
        typingDiv.remove();
    }
}

function saveChatMessage(sender, text) {
    var message = {
        sender: sender,
        text: text,
        time: new Date().toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'}),
        date: new Date().toLocaleDateString('fa-IR')
    };
    
    chatMessages.push(message);
    localStorage.setItem('chatHistory', JSON.stringify(chatMessages));
    
    if (chatMessages.length > 100) {
        chatMessages = chatMessages.slice(-50);
        localStorage.setItem('chatHistory', JSON.stringify(chatMessages));
    }
}

function clearChat() {
    if (confirm('آیا مطمئن هستید می‌خواهید تاریخچه چت را پاک کنید؟')) {
        chatMessages = [];
        localStorage.removeItem('chatHistory');
        
        var chatContainer = document.getElementById('chatMessages');
        if (chatContainer) {
            chatContainer.innerHTML = '';
            addBotMessage('سلام! چت جدید شروع شد. چگونه می‌توانم کمک کنم؟');
        }
    }
}

function saveChat() {
    var chatText = 'تاریخچه چت پشتیبانی\n' + new Date().toLocaleString('fa-IR') + '\n\n';
    
    chatMessages.forEach(function(msg) {
        var sender = msg.sender === 'bot' ? 'پشتیبانی' : 'شما';
        chatText += sender + ' (' + msg.time + '): ' + msg.text + '\n';
    });
    
    var blob = new Blob([chatText], {type: 'text/plain;charset=utf-8'});
    var url = URL.createObjectURL(blob);
    
    var link = document.createElement('a');
    link.href = url;
    link.download = 'chat-history-' + new Date().toISOString().slice(0,10) + '.txt';
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('چت با موفقیت ذخیره شد');
}

function attachFile() {
    var input = document.createElement('input');
    input.type = 'file';
    input.className = 'file-input';
    input.accept = '.jpg,.jpeg,.png,.pdf,.txt';
    
    input.onchange = function(e) {
        var file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('حجم فایل نباید بیشتر از ۵ مگابایت باشد');
                return;
            }
            
            addUserMessage('فایل ارسال کردم: ' + file.name);
            showNotification('فایل آپلود شد (آفلاین)');
        }
    };
    
    input.click();
}

function toggleEmoji() {
    var picker = document.getElementById('emojiPicker');
    if (!picker) {
        createEmojiPicker();
        return;
    }
    
    picker.classList.toggle('show');
}
function createEmojiPicker() {
    var picker = document.createElement('div');
    picker.id = 'emojiPicker';
    picker.className = 'emoji-picker';
    
    var emojis = ['😀', '😊', '😂', '🤔', '😎', '👍', '❤️', '🔥', '⭐', '🎉', '🙏', '💯'];
    
    emojis.forEach(function(emoji) {
        var btn = document.createElement('button');
        btn.className = 'emoji-btn';
        btn.textContent = emoji;
        btn.onclick = function() {
            addEmoji(emoji);
            picker.classList.remove('show');
        };
        picker.appendChild(btn);
    });
    
    document.getElementById('chatContainer').appendChild(picker);
    picker.classList.add('show');
}

function addEmoji(emoji) {
    var input = document.getElementById('messageInput');
    input.value += emoji;
    input.focus();
}

function scrollToBottom() {
    var chatContainer = document.getElementById('chatMessages');
    if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

function showNotification(message) {
    var notification = document.createElement('div');
    notification.className = 'chat-notification';
    notification.innerHTML = '<i class="fas fa-bell"></i> ' + message;
    
    document.body.appendChild(notification);
    notification.classList.add('show');
    
    setTimeout(function() {
        notification.classList.remove('show');
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 3000);
}

function autoWelcome() {
    if (chatMessages.length === 1) {
        setTimeout(function() {
            addBotMessage('اگر سوال خاصی درباره محصولات، قیمت یا گارانتی دارید، بپرسید.');
        }, 2000);
    }
}

function updateUserName() {
    var name = prompt('لطفا نام خود را وارد کنید:', localStorage.getItem('chatUserName') || '');
    if (name && name.trim() !== '') {
        localStorage.setItem('chatUserName', name.trim());
        document.getElementById('userName').textContent = name.trim();
        showNotification('نام شما ثبت شد');
    }
}

document.getElementById('userName').addEventListener('click', updateUserName);

document.addEventListener('DOMContentLoaded', initChat);

function sendToSupportPanel(userMessage) {
    var supportQueue = JSON.parse(localStorage.getItem('supportQueue')) || [];
    supportQueue.push({
        user: localStorage.getItem('chatUserName') || 'کاربر ناشناس',
        message: userMessage,
        time: new Date().toLocaleTimeString('fa-IR', {hour:'2-digit', minute:'2-digit'})
    });
    localStorage.setItem('supportQueue', JSON.stringify(supportQueue));
    renderSupportQueue();
}

function renderSupportQueue() {
    var queue = JSON.parse(localStorage.getItem('supportQueue')) || [];
    var container = document.getElementById('supportQueue');
    container.innerHTML = '';
    queue.forEach(function(msg, index) {
        var div = document.createElement('div');
        div.style.borderBottom = '1px solid #444';
        div.style.padding = '8px 0';
        div.innerHTML = '<strong>' + msg.user + '</strong> (' + msg.time + '):<br>' + msg.message;
        container.appendChild(div);
    });
}

function clearSupportQueue() {
    if(confirm('آیا مطمئن هستید می‌خواهید تمام پیام‌های پشتیبانی را پاک کنید؟')){
        localStorage.removeItem('supportQueue');
        renderSupportQueue();
    }
}

document.addEventListener('DOMContentLoaded', function(){
    renderSupportQueue();
});