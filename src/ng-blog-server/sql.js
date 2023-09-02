const Sequelize = require("sequelize");
const crypto = require("crypto");

const sequelize = new Sequelize("ngblog", "root", "123456", {
    host: "localhost",
    dialect: "mariadb",
    port: 3307,
    dialectOptions: {
        timezone: process.env.db_timezone
    }
});

const User = sequelize.define('user', {
    name: { type: Sequelize.STRING, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false },
    salt: { type: Sequelize.STRING, allowNull: false }
});

const Article = sequelize.define('article', {
    title: { type: Sequelize.STRING },
    key: { type: Sequelize.STRING },
    date: { type: Sequelize.DATE },
    content: { type: Sequelize.TEXT },
    description: { type: Sequelize.TEXT },
    imageUrl: { type: Sequelize.STRING },
    viewCount: { type: Sequelize.INTEGER },
    published: { type: Sequelize.BOOLEAN }
});

init = function () {
    sequelize
        .authenticate()
        .then(() => {
            console.log("Connection has been established successfully!");
        }).catch(err => {
            console.log("Unable to connect to database: " + err);
        });

    Article.sync({ force: true }).then(() => {
        Article.create({
            title: 'My first article',
            content: '<p>Mauris rhoncus dui nibh, ac tempus dolor elementum ac. Integer tempor, ipsum eu venenatis porttitor, turpis orci dictum metus, eu iaculis elit turpis non ex. Integer et nunc eget mauris mattis blandit. Nam sem justo, blandit eget hendrerit nec, sagittis a nisi. Praesent ullamcorper blandit aliquam. Nulla non scelerisque felis, vitae dictum lectus. Phasellus et interdum velit. Vivamus sed imperdiet nulla. Fusce ornare fermentum porta. Nunc ut est non leo tempor mollis. Vivamus nibh turpis, porta in faucibus vitae, egestas non est. Aliquam in urna nisl. Nulla facilisi. Aliquam dui ipsum, vulputate eget lorem id, pulvinar fermentum nulla.</p><p>Mauris rhoncus dui nibh, ac tempus dolor elementum ac. Integer tempor, ipsum eu venenatis porttitor, turpis orci dictum metus, eu iaculis elit turpis non ex. Integer et nunc eget mauris mattis blandit. Nam sem justo, blandit eget hendrerit nec, sagittis a nisi. Praesent ullamcorper blandit aliquam. Nulla non scelerisque felis, vitae dictum lectus. Phasellus et interdum velit. Vivamus sed imperdiet nulla. Fusce ornare fermentum porta. Nunc ut est non leo tempor mollis. Vivamus nibh turpis, porta in faucibus vitae, egestas non est. Aliquam in urna nisl. Nulla facilisi. Aliquam dui ipsum, vulputate eget lorem id, pulvinar fermentum nulla.</p>',
            description: "This is my first artice! It's great. Please read it. :)",
            key: 'my-first-article',
            date: new Date(),
            imageUrl: 'http://angular.io/assets/images/logos/angular/angular.png',
            published: true
        });

        Article.create({
            title: 'The second article',
            content: '<p>Mauris rhoncus dui nibh, ac tempus dolor elementum ac. Integer tempor, ipsum eu venenatis porttitor, turpis orci dictum metus, eu iaculis elit turpis non ex. Integer et nunc eget mauris mattis blandit. Nam sem justo, blandit eget hendrerit nec, sagittis a nisi. Praesent ullamcorper blandit aliquam. Nulla non scelerisque felis, vitae dictum lectus. Phasellus et interdum velit. Vivamus sed imperdiet nulla. Fusce ornare fermentum porta. Nunc ut est non leo tempor mollis. Vivamus nibh turpis, porta in faucibus vitae, egestas non est. Aliquam in urna nisl. Nulla facilisi. Aliquam dui ipsum, vulputate eget lorem id, pulvinar fermentum nulla.</p><p>Mauris rhoncus dui nibh, ac tempus dolor elementum ac. Integer tempor, ipsum eu venenatis porttitor, turpis orci dictum metus, eu iaculis elit turpis non ex. Integer et nunc eget mauris mattis blandit. Nam sem justo, blandit eget hendrerit nec, sagittis a nisi. Praesent ullamcorper blandit aliquam. Nulla non scelerisque felis, vitae dictum lectus. Phasellus et interdum velit. Vivamus sed imperdiet nulla. Fusce ornare fermentum porta. Nunc ut est non leo tempor mollis. Vivamus nibh turpis, porta in faucibus vitae, egestas non est. Aliquam in urna nisl. Nulla facilisi. Aliquam dui ipsum, vulputate eget lorem id, pulvinar fermentum nulla.</p>',
            description: "Also great article!",
            key: 'the-second-article',
            date: new Date(),
            imageUrl: 'http://angular.io/assets/images/logos/angular/angular_solidBlack.png',
            published: false
        });
    });

    User.sync();
};

getArticles = function (callback) {
    Article.findAll({
        order: Sequelize.literal("date DESC"),
        where: { published: true }
    }).then(articles => callback(articles));
};

getArticleByKey = function (options, callback) {
    Article.findOne({ where: { key: options.key, published: true } })
        .then(article => {
            if (article != null) {
                article.update({
                    viewCount: ++article.viewCount
                });
            }
            callback(article)
        });
};

getDashboardArticles = function (callback) {
    Article.findAll({ order: Sequelize.literal("date DESC") }).then(articles => callback(articles));
};

updateArticlePublishState = function (request, callback) {
    Article.findOne({ where: { id: request.id } }).then(function (article) {
        if (article != null) {
            article.update({
                published: request.published
            });
        }
        callback(article);
    });
};

getDashboardArticleByKey = function (key, callback) {
    Article.findOne({ where: { key: key } }).then(article => callback(article));
}

updateArticle = function (request, callback) {
    Article.findOne({ where: { id: request.id } }).then(function (article) {
        article.update({
            title: request.title,
            key: request.key,
            date: request.date,
            imageUrl: request.imageUrl,
            description: request.description,
            content: request.content
        });
        callback(article);
    });
}

deleteArticle = function (id, callback) {
    Article.findOne({ where: { id: id } }).then(function (article) {
        if (article != null) {
            article.destroy().then(result => callback(result));
        } else {
            callback(null);
        }
    });
}

createArticle = function (request, callback) {
    Article.create({
        title: request.title,
        key: request.key,
        date: request.date,
        imageUrl: request.imageUrl,
        description: request.description,
        content: request.content
    }).then(article => callback(article));
}

addUser = function (user, callback) {
    User.create({
        name: user.name.toLowerCase(),
        password: user.password,
        salt: user.salt
    }).then(callback(true));
}

login = function (request, callback) {
    User.findOne({
        where: {
            name: request.name
        }
    }).then(function (user) {
        if (user !== null) {
            var passwordhHash = crypto
                .pbkdf2Sync(request.password, user.salt, 1000, 64, "sha512")
                .toString("hex");

            if (passwordhHash === user.password) {
                callback(true);
                return;
            }
        }

        callback(false);
    });
}

module.exports.init = init;
module.exports.getArticles = getArticles;
module.exports.getArticleByKey = getArticleByKey;
module.exports.getDashboardArticles = getDashboardArticles;
module.exports.updateArticlePublishState = updateArticlePublishState;
module.exports.getDashboardArticleByKey = getDashboardArticleByKey;
module.exports.updateArticle = updateArticle;
module.exports.deleteArticle = deleteArticle;
module.exports.createArticle = createArticle;
module.exports.addUser = addUser;
module.exports.login = login;