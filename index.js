var markdown = require('remarked');
const express = require('express');
const app = express();
const fs = require('fs')
const matter = require('gray-matter');
const ejs = require('ejs');
const fetch = require('node-fetch')
var cf = require('node_cloudflare');
let postcss = require('postcss')



async function getUrls() {
	let array = ['/', 'blog', 'about', 'scratch', 'portfolio']
	files = fs.readdirSync("./blog/")
	for (var i in files) {
		var post = await fs.promises.readFile(`./blog/${files[i]}`, "utf-8");
		var matteredData = matter(post);
		matteredData.data.url = files[i].replace(".md", "");
		fetch(`https://social.wgyt.tk/comments/ensure/${matteredData.data.url}`)
		array.push('/blog/' + matteredData.data.url);
	}
	console.log(array)
	array = array
	return array
}
app.use(express.static('public'))
console.log("starting server")

app.get('/', (req, res) => {
	const about = fs.readFileSync(`includes/about.html`, 'utf8')
	const blog = fs.readFileSync(`includes/blogpostlist.html`, 'utf8')
	const portfolio = fs.readFileSync(`includes/portfolio.html`, 'utf8')
	const header = fs.readFileSync(`includes/header.html`, 'utf8')
	const footer = fs.readFileSync(`includes/footer.html`, 'utf8')
	ejs.renderFile(
		`${__dirname}/views/index.html`, {
			about: about,
			blog: blog,
			portfolio: portfolio,
			header: header,
			footer: footer
		},
		function(err, str) {
			res.send(str)
		});
});

app.get('/blog', (req, res, next) => {
	ejs.renderFile(
		`${__dirname}/views/blog.html`, {},
		function(err, str) {
			res.send(str)
		});
});
app.get('/blog/:post', (req, res, next) => {
	if (fs.existsSync(`blog/${req.params.post}.md`)) {
		const data = fs.readFileSync(`blog/${req.params.post}.md`, 'utf8')
		mattered = matter(fs.readFileSync(`blog/${req.params.post}.md`, 'utf8'))
		mattered.data.url = req.params.post

      const options = { year: "numeric", month: "long", day: "numeric" };
      let date = new Date(mattered.data.date).toLocaleDateString("en-US");


    mattered.data.formattedDate = date
		ejs.renderFile(
			`${__dirname}/views/blogtemplate.html`, {
				data: mattered,
				md: markdown(mattered.content),
			},
			function(err, str) {
				res.send(str)
			});
	} else {
		next() // if it 404's show 404 page
	}
});
app.get('/api/blog', (req, res, next) => {
	let array = [];
	fs.readdir("./blog/", async (err, files) => {
		for (var i in files) {
			var post = await fs.promises.readFile(`./blog/${files[i]}`, "utf-8");
			var matteredData = matter(post);
			matteredData.data.url = files[i].replace(".md", "");
			fetch(`https://social.wgyt.tk/comments/ensure/${matteredData.data.url}`)
			array.push(matteredData);
		}
		//sort array real quick
		array.sort(function(a, b) {
			if (a.data.date > b.data.date) {
				return -1;
			}
			if (a.data.date < b.data.date) {
				return 1;
			}
			return 0;
		});


		res.send(array)
	})
})

app.get('/portfolio', (req, res) => {
	const portfolio = fs.readFileSync(`includes/portfolio.html`, 'utf8')
	const header = fs.readFileSync(`includes/header.html`, 'utf8')
	const footer = fs.readFileSync(`includes/footer.html`, 'utf8')
	ejs.renderFile(
		`${__dirname}/views/portfolio.html`, {
			portfolio: portfolio,
			header: header,
			footer: footer
		},
		function(err, str) {
			res.send(str)
		});
});
app.get('/offline.html', (req, res) => {
	res.sendFile(`${__dirname}/offline.html`)
});
app.get(`/js/service-worker.js`, (req, res) => {
	res.redirect(301, '/js/sw.js')
})
app.get(`/wp-login.php`, (req, res) => {
	res.redirect(301, '/blog/super-bowl-and-wp-login')
})
app.get(`/sitemap.xml`, (req, res) => {
	res.set('Content-Type', 'text/xml');
	res.send(`<?xml version="1.0" encoding="UTF-8"?><urlsetxmlns="http://www.sitemaps.org/schemas/sitemap/0.9"xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"><url><loc>https://www.wgyt.tk/</loc><changefreq>daily</changefreq><priority>1.00</priority></url><url><loc>https://www.wgyt.tk/blog</loc><changefreq>daily</changefreq><priority>0.90</priority></url><url><loc>https://www.wgyt.tk/portfolio</loc><changefreq>daily</changefreq><priority>0.90</priority></url><url><loc>https://www.wgyt.tk/blog/super-bowl-and-wp-login</loc><changefreq>daily</changefreq><priority>0.90</priority></url><url><loc>https://www.wgyt.tk/blog/new-tailwind-site-design</loc><changefreq>daily</changefreq><priority>0.90</priority></url><url><loc>https://www.wgyt.tk/blog/my-science-project</loc><changefreq>daily</changefreq><priority>0.90</priority></url><url><loc>https://www.wgyt.tk/blog/comments-on-my-blog</loc><changefreq>daily</changefreq><priority>0.90</priority></url><url><loc>https://www.wgyt.tk/blog/my-first-blog-post</loc><changefreq>daily</changefreq><priority>0.90</priority></url></urlset>`)
})
app.use((req, res, next) => {
	// 404 page always last
	var ip_address = (req.connection.remoteAddress ? req.connection.remoteAddress : req.remoteAddress);
	// console.log(cf.get(req))
	console.log(`404 at ${req.path.replace(/%20/g,' ')}`)
	res.status(404).sendFile(`${__dirname}/includes/404.html`)
});

cf.load(function(error, fs_error) {
	if (fs_error) {
		throw new Error(fs_error);
	}
	app.listen(3000);
	console.log('Server running.');
});