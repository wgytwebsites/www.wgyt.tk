var markdown = require('remarked');
const express = require('express');
const app = express();
const fs = require('fs')
const matter = require('gray-matter');
const ejs = require('ejs');
const fetch = require('node-fetch')
app.use(express.static('public'))
console.log("starting server")

app.get('/', (req, res) => {
  const about = fs.readFileSync(`includes/about.html`, 'utf8')
  const blog = fs.readFileSync(`includes/blogpostlist.html`, 'utf8')
  const scratch = fs.readFileSync(`includes/scratch.html`, 'utf8')
  const portfolio = fs.readFileSync(`includes/portfolio.html`, 'utf8')
  const header = fs.readFileSync(`includes/header.html`, 'utf8')
  const footer = fs.readFileSync(`includes/footer.html`, 'utf8')
  ejs.renderFile(
    `${__dirname}/views/index.html`, {about:about,blog:blog,scratch:scratch,portfolio:portfolio,header:header,footer:footer}, function(err, str){
      res.send(str)
  });
});

app.get('/about', (req, res) => {
  const about = fs.readFileSync(`includes/about.html`, 'utf8')
  const header = fs.readFileSync(`includes/header.html`, 'utf8')
  const footer = fs.readFileSync(`includes/footer.html`, 'utf8')
  ejs.renderFile(
    `${__dirname}/views/about.html`, {}, function(err, str){
      res.send(str)
});
});

app.get('/blog', (req, res, next) => {
  ejs.renderFile(
    `${__dirname}/views/blog.html`, {}, function(err, str){
      res.send(str)
  });
});
app.get('/blog/:post', (req, res, next) => {
  if (fs.existsSync(`blog/${req.params.post}.md`)) {
  const data = fs.readFileSync(`blog/${req.params.post}.md`, 'utf8')
  mattered = matter(fs.readFileSync(`blog/${req.params.post}.md`, 'utf8'))
  mattered.data.url = req.params.post
  ejs.renderFile(
    `${__dirname}/views/blogtemplate.html`, {data: mattered, md: markdown(mattered.content)}, function(err, str){
      console.log(err)
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
    array.sort(function (a, b) {
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



app.get('/scratch', (req, res) => {
  const scratch = fs.readFileSync(`includes/scratch.html`, 'utf8')
  const header = fs.readFileSync(`includes/header.html`, 'utf8')
  const footer = fs.readFileSync(`includes/footer.html`, 'utf8')
  ejs.renderFile(
    `${__dirname}/views/scratch.html`, {scratch:scratch,header:header,footer:footer}, function(err, str){
      res.send(str)
});});

app.get('/portfolio', (req, res) => {
  const portfolio = fs.readFileSync(`includes/portfolio.html`, 'utf8')
  const header = fs.readFileSync(`includes/header.html`, 'utf8')
  const footer = fs.readFileSync(`includes/footer.html`, 'utf8')
  ejs.renderFile(
    `${__dirname}/views/portfolio.html`, {portfolio:portfolio,header:header,footer:footer}, function(err, str){
      res.send(str)
});});
app.get('/offline.html', (req, res) => {
  res.sendFile(`${__dirname}/offline.html`)
});
app.get(`/js/service-worker.js`,(req,res)=>{
  res.redirect(301, '/js/sw.js')
})
app.use((req, res, next) => {
  // 404 page always last
  console.log(`404 at ${req.path}`)
  res.status(404).sendFile(`${__dirname}/includes/404.html`)
});

app.listen(3000, () => {
  console.log('server started');
});