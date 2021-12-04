function slider() {
    const items = $('.slider-item');
    var current = 0;
    var moveImage = function() {
        items.each(function(index, item) {
            if (index == current) {
                $(item).addClass('slider-visible');
                $(item).removeClass('slider-hidden');
            } else {
                $(item).addClass('slider-hidden');
                $(item).removeClass('slider-visible');
            }
        });
        current++;
        if (current >= items.length) current = 0;
    };

    $('#right').click(function() {
        current++;
        if (current >= items.length) current = 0;
        moveImage();
        current--;
    });
    $('#left').click(function() {
        current -= 1;
        if (current < 0) current = 3;
        moveImage();
        current++;
    });

    setInterval(moveImage, 5000);
}

const previews = [
    'images/1.jpg',
    'images/2.jpg',
    'images/3.jpg'
];

class User {
    constructor(fullname, email, password, subscribers) {
        this.id = Number(localStorage.getItem('guid')) == null ? 1 : Number(localStorage.getItem('guid'));
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.subscribers = subscribers;
    }
}

class Article {
    constructor(title, text) {
        this.id = Number(localStorage.getItem('guidNews')) == null ? 1 : Number(localStorage.getItem('guidNews'));
        this.title = title;
        this.text = text;
        var date = new Date();
        this.time = date;
        this.author = current;
        this.preview = previews[Math.floor(Math.random() * 3)];
    }
}

var users = [];
var news = [];
var current = -1;
var newsId = -1;

function getUserId(email, password) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].email === email && users[i].password == password) return users[i].id;
    }
    return -1;
}

function getIndexUserId(id) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == id) return i;
    }
    return -1;
}

function getIndexNewsId(id) {
    for (let i = 0; i < news.length; i++) {
        if (news[i].id == id) return i;
    }
    return -1;
}

function isExistUser(email) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].email === email) return true;
    }
    return false;
}

function register() {
    var fullname = document.getElementById('register-name');
    var email = document.getElementById('register-email');
    var password = document.getElementById('register-password');
    var error_message = document.getElementById('error-mess');

    if (fullname.value == '' || email.value == '' || password.value == '') {
        error_message.textContent = 'Entered information is incorrect';
        return;
    }
    if (isExistUser(email.value) === true) {
        error_message.textContent = 'This account already exist';
        return;
    }

    users.push(new User(fullname.value, email.value, password.value, []));
    localStorage.setItem('footballers', JSON.stringify(users));
    localStorage.setItem('currentFootballer', users[users.length - 1].id);
    localStorage.setItem('guid', users[users.length - 1].id + 1);
    window.location.href = 'index.html';
}

function authorize() {
    var email = document.getElementById('auth-email');
    var password = document.getElementById('auth-password');
    var error_message = document.getElementById('error-mess');

    if (email.value == '' || password.value == '') {
        error_message.textContent = 'Entered information is incorrect';
        return;
    }
    if (getUserId(email.value, password.value) == -1) {
        error_message.textContent = 'Wrong login or password';
        return;
    }

    localStorage.setItem('currentFootballer', getUserId(email.value, password.value));
    window.location.href = 'index.html';
}

function createNews() {
    var title = document.getElementById('news-title');
    var text = document.getElementById('news-text');
    var error_message = document.getElementById('error-mess');

    if (title.value == '' || text.value == '') {
        error_message.textContent = 'Invalid data';
        return;
    }

    news.push(new Article(title.value, text.value));
    localStorage.setItem('news', JSON.stringify(news));
    localStorage.setItem('guidNews', news[news.length - 1].id + 1);
    window.location.href = 'index.html';
}

function getUsers() {
    users = localStorage.getItem('footballers') == null ? [] : JSON.parse(localStorage.getItem('footballers'));
}

function getNews() {
    news = localStorage.getItem('news') == null ? [] : JSON.parse(localStorage.getItem('news'));
}

function getCurrentUser() {
    current = localStorage.getItem('currentFootballer') == null ? -1 : Number(localStorage.getItem('currentFootballer'));
}

function profile() {
    $('#profile-name').text(users[getIndexUserId(current)].fullname);
    $('#profile-email').text(users[getIndexUserId(current)].email);
}

function editUser() {
    var fullname = document.getElementById('edit-name');
    var password = document.getElementById('edit-password');
    var newPassword = document.getElementById('edit-newpassword');
    var error_message = document.getElementById('error-mess');

    if (fullname.value != '') {
        users[getIndexUserId(current)].fullname = fullname.value;
        localStorage.setItem('footballers', JSON.stringify(users));
        window.location.href = 'profile.html';
    } else {
        error_message.textContent = 'Incorrect data';
    }
    if (password.value != '' &&
        getUserId(users[getIndexUserId(current)].email, password.value) != -1 &&
        newPassword.value != '' &&
        newPassword.value != password.value) {
        users[getIndexUserId(current)].password = newPassword.value;
        localStorage.setItem('footballers', JSON.stringify(users));
        window.location.href = 'profile.html';
    } else {
        error_message.textContent = 'Incorrect data or password is not equal';
    }
}

function exitUser() {
    localStorage.setItem('currentFootballer', -1);
    window.location.href = 'index.html';
}

function loadNewsPage() {
    newsId = localStorage.getItem('currentNews') == null ? -1 : Number(localStorage.getItem('currentNews'));
    if (newsId != -1 && news.length) {
        $('#news-preview').attr('src', news[getIndexNewsId(newsId)].preview);
        $('#news-title').text(news[getIndexNewsId(newsId)].title);
        $('#news-text').text(news[getIndexNewsId(newsId)].text);
        var us = users[getIndexUserId(Number(news[getIndexNewsId(newsId)].author))].fullname;
        $('#news-author').text(us);
    }
}

function loadNews() {
    $("#news").empty();
    if (news.length != 0) {
        for (let i = 0; i < news.length; i++) {
            var a = document.createElement('a');
            var img = document.createElement('img');
            var div = document.createElement('div');
            var h1 = document.createElement('h1');
            var p = document.createElement('p');

            a.href = 'infoarticle.html';
            a.title = news[i].id;
            a.className = 'card';
            a.textContent = '';

            a.onclick = function() {
                localStorage.setItem('currentNews', Number(this.title));
                window.location.href = 'infoarticle.html';
            }

            img.src = news[i].preview;
            img.className = 'preview__content';
            img.alt = ':(';

            div.className = 'card__content';
            h1.className = 'title__content';
            p.className = 'time__content';

            h1.textContent = news[i].title;
            var temp = Date.parse(news[i].time);
            var now = new Date();
            var period = (now - temp);
            var times = [1000, 60, 60, 24, 7, 4.34524, 12];
            var dimension = 'seconds';
            let j = 0;
            for (j = 0; j < times.length; j++) {
                if (period / times[j] >= 1) {
                    period /= times[j];
                } else {
                    break;
                }
            }
            switch (j) {
                case 0:
                    dimension = 'miliseconds ago';
                    break;
                case 1:
                    dimension = 'seconds ago';
                    break;
                case 2:
                    dimension = 'minutes ago';
                    break;
                case 3:
                    dimension = 'hours ago';
                    break;
                case 4:
                    dimension = 'days ago';
                    break;
                case 5:
                    dimension = 'weeks ago';
                    break;
                case 6:
                    dimension = 'months ago';
                    break;
                case 7:
                    dimension = 'years ago';
                    break;

            }
            p.textContent = Math.floor(period) + ' ' + dimension;

            div.appendChild(h1);
            div.appendChild(p);

            a.appendChild(img);
            a.appendChild(div);

            $("#news").append(a);
        }
    }
}

function contentLoad() {
    slider();

    getUsers();
    getNews();
    getCurrentUser();

    loadNews();
    loadNewsPage();

    if (current === -1) {
        console.log('-1');
        var logli = document.createElement('li');
        var log = document.createElement('a');
        log.href = 'signin.html';
        log.textContent = 'Log In';
        logli.appendChild(log);
        $('#links').append(logli);

        var regli = document.createElement('li');
        var reg = document.createElement('a');
        reg.href = 'signin.html';
        reg.textContent = 'Sign Up';
        regli.appendChild(reg);
        $('#links').append(regli);
    } else {
        profile();
        var accli = document.createElement('li');
        var acc = document.createElement('a');
        acc.href = 'profile.html';
        acc.textContent = users[getIndexUserId(current)].fullname;
        accli.appendChild(acc);
        $('#links').append(accli);
    }
}