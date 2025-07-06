import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Score from "./AccessibilityScore";
import DownloadReportButton from "./DownloadReportButton";
import '../Home.css'

const Results = () => {

    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state || !state.results) {
        return (
        <div>
            <p>No result data found.</p>
            <button onClick={() => navigate("/")}>Go Back</button>
        </div>
        );
    }
  const {results, url} = state;

    const calculateScore = (violations) => {
    console.log(url);
    const weights = { minor: 1, moderate: 2, serious: 4, critical: 6 };
    let Penalty = 0;
    violations.forEach(v => {
        if (weights[v.impact] !== undefined) {
            Penalty += weights[v.impact];
        } 
        else{
            Penalty += 1;
        }
    });
    return Math.max(0, 100 - Penalty);
  };

  return (
    <div className="results-container">
      <h3>Results for {url}</h3>
      <Score score={calculateScore(results.violations)} />
      <DownloadReportButton results={results} url={url} />

      { results.violations.length==0 ?
        (<p> No accessibility issues found! </p>)
        :(
            <>
            <h2> Found {results.violations.length} issue(s) </h2>
            {
                results.violations.map((v,idx)=>(
                    <div key={idx} className="violation">
                        <h3>{v.help}</h3>
                        <p>{v.description}</p>
                        <a href={v.helpUrl} target="_blank">
                            Learn how to fix it
                        </a>
                    </div>
                ))
            }
            </>
        )

      }
    </div>
  )
}

export default Results
