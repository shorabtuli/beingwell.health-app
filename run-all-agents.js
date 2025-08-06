const { execSync } = require('child_process');
const fs = require('fs');

class AgentRunner {
    constructor() {
        this.agents = [
            'agent-alt-text-finder.js',
            'agent-competitor-analyzer.js', 
            'agent-meta-description-auditor.js',
            'agent-content-length-auditor.js'
        ];
        
        this.results = [];
    }

    async runAllAgents() {
        console.log('🤖 Running All 4 SEO & Content Agents');
        console.log('=' .repeat(50));
        console.log('This will analyze and improve your website in 4 key areas:');
        console.log('1. Alt Text - Find and populate missing image descriptions');
        console.log('2. Competitor Analysis - Research content gaps and keywords');
        console.log('3. Meta Descriptions - Find and fix duplicate descriptions');
        console.log('4. Content Length - Identify pages under 500 words');
        console.log('\nStarting analysis...\n');

        for (let i = 0; i < this.agents.length; i++) {
            const agent = this.agents[i];
            console.log(`\n🚀 Running Agent ${i + 1}/4: ${agent}`);
            console.log('-' .repeat(40));
            
            try {
                const startTime = Date.now();
                execSync(`node ${agent}`, { stdio: 'inherit' });
                const endTime = Date.now();
                const duration = (endTime - startTime) / 1000;
                
                this.results.push({
                    agent: agent,
                    status: 'success',
                    duration: duration
                });
                
                console.log(`\n✅ Agent ${i + 1} completed in ${duration.toFixed(1)}s`);
                
            } catch (error) {
                console.log(`\n❌ Agent ${i + 1} failed: ${error.message}`);
                this.results.push({
                    agent: agent,
                    status: 'failed',
                    error: error.message
                });
            }
        }

        this.generateSummary();
    }

    generateSummary() {
        console.log('\n📊 All Agents Summary');
        console.log('=' .repeat(30));
        
        const successful = this.results.filter(r => r.status === 'success').length;
        const failed = this.results.filter(r => r.status === 'failed').length;
        
        console.log(`✅ Successful: ${successful}/4`);
        console.log(`❌ Failed: ${failed}/4`);
        
        if (successful > 0) {
            console.log('\n📈 Generated Reports:');
            const reports = [
                'competitor-analysis.json',
                'meta-description-audit.json', 
                'content-length-audit.json'
            ];
            
            reports.forEach(report => {
                if (fs.existsSync(report)) {
                    const stats = fs.statSync(report);
                    console.log(`  • ${report} (${(stats.size / 1024).toFixed(1)}KB)`);
                }
            });
        }
        
        console.log('\n🎯 Next Steps:');
        console.log('1. Review the generated reports for insights');
        console.log('2. Implement the recommended improvements');
        console.log('3. Run the agents again to verify fixes');
        console.log('4. Upload updated files to GitHub');
        
        // Save summary
        const summary = {
            timestamp: new Date().toISOString(),
            totalAgents: this.agents.length,
            successful: successful,
            failed: failed,
            results: this.results
        };
        
        fs.writeFileSync('agents-summary.json', JSON.stringify(summary, null, 2));
        console.log('\n💾 Summary saved to agents-summary.json');
    }
}

// Run all agents
const runner = new AgentRunner();
runner.runAllAgents().catch(console.error); 