const express=require("express");
const cors = require('cors');
const { readFileSync } = require('fs');
const puppeteer = require('puppeteer');



const app=express();

const port=3000;

app.use(cors());
app.use(express.json({ limit: '20mb'}));

app.post("/analyze",async(req,res)=>{
    const {url}=req.body;
    if (!url || !url.startsWith('http')) {
        return res.status(400).json({ error: 'Invalid URL' });
    }
    try{
        const browser= await puppeteer.launch({headless: 'new'});
        const page= await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        const axeScript = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
        await page.evaluate(axeScript);

        const results = await page.evaluate(async () => {
        return await axe.run();
        });

        await browser.close();
        res.json(results);
    }
    catch(err){
        console.error('Analysis failed:', err);
        res.status(500).json({ error: 'Failed to fetch and analyze the URL' });
    }
})


app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`);
})