var tickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
var products = JSON.parse(localStorage.getItem('myProducts')) || [];

function loadSupportPage() {
    loadProductSelect();
    loadTickets();
    loadFAQ();
    updateCartCount();
}

function loadProductSelect() {
    var productSelect = document.getElementById('ticketProduct');
    if (!productSelect) return;
    
    productSelect.innerHTML = '<option value="">انتخاب محصول (اختیاری)</option>';
    products.forEach(function(product) {
        productSelect.innerHTML += '<option value="' + product.id + '">' + product.name + '</option>';
    });
}

function submitTicket(event) {
    event.preventDefault();
    
    var title = document.getElementById('ticketTitle').value;
    var productId = document.getElementById('ticketProduct').value;
    var description = document.getElementById('ticketDescription').value;
    
    if (!title || !description) {
        alert('لطفا عنوان و شرح مشکل را وارد کنید');
        return;
    }
    
    var product = null;
    for (var i = 0; i < products.length; i++) {
        if (products[i].id == productId) {
            product = products[i];
            break;
        }
    }
    
    var newTicket = {
        id: Date.now(),
        title: title,
        product: product ? {
            id: product.id,
            name: product.name
        } : null,
        description: description,
        status: 'pending',
        date: new Date().toLocaleString('fa-IR'),
        responses: []
    };
    
    tickets.unshift(newTicket);
    localStorage.setItem('supportTickets', JSON.stringify(tickets));
    
    document.getElementById('ticketForm').reset();
    loadTickets();
    
    showNotification('تیکت پشتیبانی با موفقیت ثبت شد. شماره تیکت: ' + newTicket.id);
}

function loadTickets() {
    var ticketList = document.getElementById('ticketList');
    if (!ticketList) return;
    
    if (tickets.length === 0) {
        ticketList.innerHTML = '<div class="no-tickets">هنوز هیچ تیکتی ثبت نکرده‌اید</div>';
        return;
    }
    
    var html = '';
    
    tickets.forEach(function(ticket) {
        var statusClass = '';
        var statusText = '';
        
        switch(ticket.status) {
            case 'pending':
                statusClass = 'status-pending';
                statusText = 'در انتظار';
                break;
            case 'in-progress':
                statusClass = 'status-in-progress';
                statusText = 'در حال بررسی';
                break;
            case 'resolved':
                statusClass = 'status-resolved';
                statusText = 'حل شده';
                break;
        }
        
        html += '<div class="ticket-item">';
        html += '<div class="ticket-header">';
        html += '<div class="ticket-title">' + ticket.title + '</div>';
        html += '<div class="ticket-meta">';
        html += '<span class="ticket-status ' + statusClass + '">' + statusText + '</span>';
        html += '<span>' + ticket.date + '</span>';
        html += '</div>';
        html += '</div>';
        
        if (ticket.product) {
            html += '<div style="color: #aaa; margin-bottom: 10px;">محصول: ' + ticket.product.name + '</div>';
        }
        
        html += '<div class="ticket-description">' + ticket.description + '</div>';
        
        if (ticket.responses && ticket.responses.length > 0) {
            html += '<div class="ticket-response">';
            html += '<span class="response-label">پاسخ پشتیبانی:</span>';
            html += '<div class="response-content">' + ticket.responses[ticket.responses.length - 1].message + '</div>';
            html += '</div>';
        }
        
        html += '</div>';
    });
    
    ticketList.innerHTML = html;
}

function loadFAQ() {var faqContainer = document.getElementById('faqContainer');
    if (!faqContainer) return;
    
    var faqData = [
        {
            question: 'چطور می‌توانم از گارانتی محصول استفاده کنم؟',
            answer: 'برای استفاده از گارانتی، لطفا شماره سریال محصول و فاکتور خرید را همراه داشته باشید و با پشتیبانی تماس بگیرید.'
        },
        {
            question: 'زمان پاسخگویی پشتیبانی چه ساعاتی است؟',
            answer: 'پشتیبانی تلفنی: شنبه تا چهارشنبه ۹ صبح تا ۵ عصر<br>پشتیبانی آنلاین: ۲۴ ساعته از طریق تیکت'
        },
        {
            question: 'چطور می‌توانم محصول برگشتی را ارسال کنم؟',
            answer: 'ابتدا از طریق سیستم تیکت درخواست بازگشت را ثبت کنید. پس از تایید، آدرس ارسال و مراحل بعدی برای شما ارسال می‌شود.'
        },
        {
            question: 'آیا امکان نصب و راه‌اندازی دارید؟',
            answer: 'بله، برای محصولات خاص خدمات نصب و راه‌اندازی ارائه می‌دهیم. لطفا هنگام خرید یا از طریق تیکت درخواست دهید.'
        }
    ];
    
    var html = '';
    
    faqData.forEach(function(item, index) {
        html += '<div class="faq-item">';
        html += '<div class="faq-question" onclick="toggleFAQ(' + index + ')">';
        html += item.question;
        html += '<i class="fas fa-chevron-down"></i>';
        html += '</div>';
        html += '<div class="faq-answer" id="faq-answer-' + index + '">';
        html += item.answer;
        html += '</div>';
        html += '</div>';
    });
    
    faqContainer.innerHTML = html;
}

function toggleFAQ(index) {
    var answer = document.getElementById('faq-answer-' + index);
    var icon = answer.previousElementSibling.querySelector('i');
    
    answer.classList.toggle('active');
    
    if (answer.classList.contains('active')) {
        icon.style.transform = 'rotate(180deg)';
    } else {
        icon.style.transform = 'rotate(0deg)';
    }
}

function showNotification(message) {
    var notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = message;
    notification.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #FFD700; color: #000; padding: 15px 25px; border-radius: 8px; z-index: 9999; box-shadow: 0 5px 15px rgba(0,0,0,0.3);';
    document.body.appendChild(notification);
    setTimeout(function() { notification.remove(); }, 3000);
}

if (typeof updateCartCount === 'function') {
    updateCartCount();
}