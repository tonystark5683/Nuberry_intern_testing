import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

const ForecastGraph = () => {
  useEffect(() => {
    const coordinates = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    };

    const storeData  = [
      { store: 'Chrompet', color: 'rgba(75, 192, 192, 1)', users: 150, marketshare: 140, departments: [
        { department: 'Clothing', users: 30, categories: [
          { category: 'cat1', users: 23 },
          { category: 'cat2', users: 46 },
          { category: 'cat3', users: 12 },
          { category: 'cat4', users: 30 },
        ]},
        { department: 'Accessories', users: 70, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
        { department: 'Baby Care', users: 40, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
        { department: 'Footwear', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
        { department: 'Baby Gear', users: 50, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
        { department: 'Bedding & Furniture', users: 50, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
        { department: 'Games & Toys', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
      ]},
      { store: 'Adyar', color: 'rgba(75, 192, 192, 1)', users: 50, marketshare: 80, departments: [
        { department: 'Clothing', users: 30, categories: [
          { category: 'Men', users: 5 },
          { category: 'Women', users: 5 },
        ]},
        { department: 'Accessories', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
        { department: 'Baby Care', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
        { department: 'Footwear', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
        { department: 'Baby Gear', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
        { department: 'Bedding & Furniture', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
        { department: 'Games & Toys', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
      ]},
      { store: 'Shanthi Colony', color: 'rgba(75, 192, 192, 1)', users: 250, marketshare: 40, departments: [
        { department: 'Clothing', users: 43, categories: [
          { category: 'Men', users: 5 },
          { category: 'Women', users: 5 },
        ]},
        { department: 'Accessories', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
        { department: 'Baby Care', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
        { department: 'Footwear', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
        { department: 'Baby Gear', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
        { department: 'Bedding & Furniture', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
        { department: 'Games & Toys', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
      ]},
      { store: 'Velachery', color: 'rgba(75, 192, 192, 1)', users: 250, marketshare:27, departments: [
        { department: 'Clothing', users: 56, categories: [
          { category: 'Men', users: 5 },
          { category: 'Women', users: 5 },
        ]},
        { department: 'Accessories', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
        { department: 'Baby Care', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
        { department: 'Footwear', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
        { department: 'Baby Gear', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
        { department: 'Bedding & Furniture', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
        { department: 'Games & Toys', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
      ]},
      { store: 'Sarath Mall', color: 'rgba(75, 192, 192, 1)', users: 250, marketshare: 87, departments: [
        { department: 'Clothing', users: 42, categories: [
          { category: 'Men', users: 5 },
          { category: 'Women', users: 5 },
        ]},
        { department: 'Accessories', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
        { department: 'Baby Care', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
        { department: 'Footwear', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
        { department: 'Baby Gear', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
        { department: 'Bedding & Furniture', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
        { department: 'Games & Toys', users: 20, categories: [
          { category: 'Jewelry', users: 10 },
          { category: 'Handbags', users: 10 },
        ]},
      ]}, 

    ];

    const data = {
      datasets: [
        {
          label: 'Stores',
          data: storeData,
          backgroundColor: 'rgba(75, 192, 192, 1)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    const resetButton = {
      id: 'resetButton',
      beforeDraw(chart, args, options) {
        const { ctx, chartArea: { top, bottom, left, right, width, height } } = chart;
        ctx.save();

        const text = 'Back';
        const thickBorder = 3;
        const textWidth = ctx.measureText(text).width;

        ctx.fillStyle = 'rgba(255, 26, 104, 0.2)';
        ctx.fillRect(right - (textWidth + 1 + 10), 5, textWidth + 10, 20);

        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.fillText(text, right - (textWidth + 1 + 5), 15);

        ctx.lineWidth = thickBorder + 'px';
        ctx.strokeStyle = 'rgba(255, 26, 104, 1)';
        ctx.strokeRect(right - (textWidth + 1 + 10), 5, textWidth + 10, 20);

        coordinates.top = 5;
        coordinates.bottom = 25;
        coordinates.left = right - (textWidth + 1 + 10);
        coordinates.right = right;

        ctx.restore();
      },
    };

    const config = {
      type: 'bar',
      data,
      options: {
        plugins: {
          tooltip: {
            yAlign: 'bottom',
          },
        },
        onHover: (event, chartElement) => {
          const level = myChart.config.data.datasets[0].label.toLowerCase();
          event.native.target.style.cursor = (level === 'stores' && chartElement[0]) ? 'pointer' : 'default';
        },
        parsing: {
          xAxisKey: 'store',
          yAxisKey: 'marketshare',
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: [resetButton],
      },
    };

    const ctx = document.getElementById('myChart');

    const myChart = new Chart(ctx, config);

    function changeChart(level,index) {
      const currentData = level === 'store' ? storeData : (level === 'department' ? storeData[index].departments : storeData[index].departments[index].categories);
      // const vColor = [];
      const vColor = 'rgba(75, 192, 192, 1)';
      const vUsers = [];
      const vLabels = currentData.map((item) => {
        // vColor.push(item.color);
        vUsers.push(item.users || 0);
        return item.category || item.department || item.store;
      });
      myChart.config.data.datasets[0].data = vUsers;
      myChart.config.data.labels = vLabels;
      myChart.config.data.datasets[0].backgroundColor = vColor;
      myChart.config.data.datasets[0].borderColor = vColor;
      myChart.config.data.datasets[0].label = level === 'store' ? 'Stores' : (level === 'department' ? 'departments' : 'categories');
      myChart.update();
    }

    function clickHandler(click) {
      // if (myChart.config.data.datasets[0].label === 'Forcast Data') {
      //   const bar = myChart.getElementsAtEventForMode(click, 'nearest', { intersect: true }, true);
      //   console.log(bar);
      //   if (bar.length) {
      //     console.log(bar[0].index);
      //     changeChart(bar[0].index);
      //   }
      // }
      const level = myChart.config.data.datasets[0].label.toLowerCase();
  if (level === 'stores' && myChart.config.data.labels[0] === 'Chrompet') {
    // Simulating drill-down from Store A to its departments
    changeChart('department', 0);
  } else if (level === 'departments' && myChart.config.data.labels[0] === 'Clothing') {
    // Simulating drill-down from Department 1 to its sub-departments
    changeChart('category', 0);
  }
    }

    function resetChart() {
      console.log('clicked reset Button!');
    }

    function mousemoveHandler(canvas, mousemove) {
      const x = mousemove.offsetX;
      const y = mousemove.offsetY;

      if (x > coordinates.left && x < coordinates.right && y > coordinates.top && y < coordinates.bottom) {
        canvas.style.cursor = 'pointer';
      } else {
        canvas.style.cursor = 'default';
      }
    }

    function clickButtonHandler(canvas, click) {
      const x = click.offsetX;
      const y = click.offsetY;

      if (x > coordinates.left && x < coordinates.right && y > coordinates.top && y < coordinates.bottom) {
        resetChart();
      }
    }

    ctx.onclick = clickHandler;
    ctx.addEventListener('mousemove', (e) => {
      mousemoveHandler(ctx, e);
    });
    ctx.addEventListener('click', (e) => {
      clickButtonHandler(ctx, e);
    });

    // Cleanup function to destroy the chart on component unmount
    return () => {
      myChart.destroy();
    };
  }, []); // Empty dependency array to run the effect only once on mount

  return (
    <div style={{ width: '60%', height: '80vh', display:'flex',flexDirection:'column', justifyContent:'center',alignItems:'center', margin:'auto'}}>      <canvas id="myChart" ></canvas>
    </div>
  );
};

export default ForecastGraph;

