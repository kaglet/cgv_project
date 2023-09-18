const { merge } = require('webpack-merge');
const commonConfiguration = require('./webpack.common.js');

const infoColor = (_message) => {
    return `\u001b[1m\u001b[34m${_message}\u001b[39m\u001b[22m`;
};

module.exports = merge(commonConfiguration, {
    mode: 'development',
    devServer: {
        host: '0.0.0.0',
        port: 8080, // Use the desired port
        //contentBase: './dist',
       // watchContentBase: true,
        open: true,
        https: false,
        // Remove the useLocalIp property
        onListening: function (server) {
            const port = server.options.port;
            const https = server.options.https ? 's' : '';
            const localIp = '127.0.0.1'; // Manually specify the local IP address
            const domain1 = `http${https}://${localIp}:${port}`;
            const domain2 = `http${https}://localhost:${port}`;
        
            console.log(`Project running at:\n  - ${infoColor(domain1)}\n  - ${infoColor(domain2)}`);
        },
    },
});
