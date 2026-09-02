const https = require('https');
https.get('https://api.github.com/repos/minjiyapremier123-coder/MetrologyHub/actions/runs', { headers: { 'User-Agent': 'Node.js' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        let parsed = JSON.parse(data);
        const runId = parsed.workflow_runs[0].id;
        console.log('Latest Run ID:', runId);

        https.get(`https://api.github.com/repos/minjiyapremier123-coder/MetrologyHub/actions/runs/${runId}/jobs`, { headers: { 'User-Agent': 'Node.js' } }, (res2) => {
            let data2 = '';
            res2.on('data', chunk => data2 += chunk);
            res2.on('end', () => {
                let jobs = JSON.parse(data2);
                const jobId = jobs.jobs[0].id;
                console.log('Latest Job ID:', jobId);

                https.get(`https://api.github.com/repos/minjiyapremier123-coder/MetrologyHub/actions/jobs/${jobId}/logs`, { headers: { 'User-Agent': 'Node.js' } }, (res3) => {
                    if (res3.statusCode === 302) {
                        https.get(res3.headers.location, (res4) => {
                            let logData = '';
                            res4.on('data', chunk => logData += chunk);
                            res4.on('end', () => require('fs').writeFileSync('github_log.txt', logData));
                        });
                    }
                });
            });
        });
    });
});
