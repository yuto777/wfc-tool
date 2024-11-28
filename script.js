const API_KEY = 'your_api_key'; // OpenWeatherMap APIキーを設定

// 天気データを取得する関数
async function fetchWeatherData() {
    const city = document.getElementById('cityInput').value;
    if (!city) {
        alert('都市名を入力してください');
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ja`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== '200') {
            alert('都市名が見つかりませんでした');
            return;
        }

        const times = data.list.map(item => item.dt_txt);
        const temperatures = data.list.map(item => item.main.temp);
        const weatherConditions = data.list.map(item => item.weather[0].description);
        const weatherIcons = data.list.map(item => item.weather[0].icon);

        plotWeatherGraph(times, temperatures, weatherConditions, weatherIcons);
    } catch (error) {
        console.error('エラー:', error);
        alert('データ取得中にエラーが発生しました');
    }
}

// グラフを描画する関数
function plotWeatherGraph(times, temperatures, weatherConditions, weatherIcons) {
    const trace1 = {
        x: times,
        y: temperatures,
        type: 'scatter',
        mode: 'lines+markers',
        name: '温度(°C)',
        line: {color: 'blue'}
    };

    const layout = {
        title: '温度の折れ線グラフ',
        xaxis: {title: '日時'},
        yaxis: {title: '温度(°C)'},
        showlegend: true,
        annotations: []  // アイコンを追加するための空の配列
    };

    // 天気アイコンをannotationsとして追加
    weatherIcons.forEach((icon, index) => {
        const iconUrl = `http://openweathermap.org/img/wn/${icon}.png`;

        layout.annotations.push({
            x: times[index],
            y: temperatures[index],
            xanchor: 'center',
            yanchor: 'bottom',
            text: '',
            showarrow: false,
            ax: 0,
            ay: -10,
            font: {
                size: 20
            },
            image: {
                source: iconUrl,  // アイコンの画像URLを指定
                width: 30,  // アイコンのサイズ
                height: 30
            }
        });
    });

    const data = [trace1];
    Plotly.newPlot('chart', data, layout);
}
