const express=require("express");
const cors = require('cors');
const { readFileSync } = require('fs');
const puppeteer = require('puppeteer');
const PDFDocument = require('pdfkit');


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

app.post("/report",(req,res)=>{
    const {results ,url} =req.body;

    if (!results) {
        return res.status(400).json({ error: 'Missing results' });
    }
    if (!url) {
        return res.status(400).json({ error: 'Missing URL' });
    }
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="accessibility-report.pdf"');
    doc.pipe(res);

    doc.fontSize(20).text('Accessibility Audit Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Scanned URL: ${url}`);
    doc.moveDown();

  if (results.violations.length === 0) {
    doc.text('✅ No accessibility violations found.');
  } else {
    results.violations.forEach((issue, index) => {
      doc.moveDown().fontSize(12).fillColor('red').text(`Issue ${index + 1}: ${issue.help}`);
      doc.font('Helvetica').fillColor('black');
      doc.text(`Impact: ${issue.impact}`);
      doc.text(`Description: ${issue.description}`);
      if (issue.nodes && issue.nodes.length > 0) {
        doc.text(`Affected Element: ${issue.nodes[0].html}`);
      }
    });
  }

  doc.end();
})


app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`);
})