//孙平 515030910451 2018年数据可视化与可视分析第四次作业
// 读数据
queue()
    .defer(d3.json, "maps/zh-mainland-provinces.topo.json")
    .defer(d3.csv, "data/地区生产总值.csv")
    .defer(d3.csv, "data/地方财政收入.csv")
    .defer(d3.csv, "data/地方财政支出.csv")
    .defer(d3.csv, "data/工业增加值.csv")
    .defer(d3.csv, "data/教育经费.csv")
    .defer(d3.csv, "data/金融业增加值.csv")
    .defer(d3.csv, "data/居民人均可支配收入.csv")
    .defer(d3.csv, "data/年末常住人口.csv")
    .defer(d3.csv, "data/住宿餐饮业.csv")
    .defer(d3.csv, "data/外商投资进出口额.csv")
    .await(draw);

//画整个工程的函数
function draw(error,mainland,d1,d2,d3_,d4,d5,d6,d7,d8,d9,d10) {

    var choose = d3.select("#choose").append("svg")
        .attr("width",1440)
        .attr("height",100);

    //介绍部分
    intro = choose.append("g").attr("id","intro")
    intro.append("g")
        .append("text")
        .attr("x",460)
        .attr("y",20)
        .text("可视化第四次作业——中国统计局各省份数据可视化")
        .attr("fill","steelblue")
    intro.append("g")
        .append("text")
        .attr("x",800)
        .attr("y",50)
        .text("by 孙平 515030910451")
        .attr("font-size",12)
        .attr("fill","steelblue")

    //选择展示地图
    choose_map = choose.append("g").attr("id","choose_map")

    choose_map.append("g")
        .append("rect")
        .attr('id',"choose_map_rect")
        .attr("width",100)
        .attr("height",35)
        .attr("x",530)
        .attr("y",60)
        .attr("fill","#eeeeee")
    choose_map.append("g")
        .append("text")
        .attr('id',"choose_map_text")
        .attr("x",545)
        .attr("y",82)
        .text("GDP地图")
        .attr("fill","steelblue")

    choose_map.on("click",function (){
        d3.select(this).remove()
            var map = drawMap(error,mainland,d1);
        })

    //选择展示线面积图
    choose_LC = choose.append("g").attr("id","choose_LC")
    choose_LC.append("g")
        .append("rect")
        .attr('id',"choose_LC_rect")
        .attr("width",120)
        .attr("height",35)
        .attr("x",657)
        .attr("y",60)
        .attr("fill","#eeeeee")

    choose_LC.append("g")
        .append("text")
        .attr('id',"choose_LC_text")
        .attr("x",667)
        .attr("y",82)
        .text("数据线面积图")
        .attr("fill","steelblue")

    choose_LC.on("click",function (){
            d3.select(this).remove()
            var lineChart = drawLineChart(error,d1,d2,d3_,d4,d5,d6,d7,d8,d9,d10);
        })
    //var map = drawMap(error,mainland,d1);
    //var lineChart = drawLineChart(error,d1,d2,d3_,d4,d5,d6,d7,d8,d9,d10);
}

//画地图的函数
function drawMap(error,mainland,d) {
    //Data input
    var gdpdata = []
    for(var i = 0;i < 31;i++) {
      gdpdata.push([d[i].province, parseFloat(d[i].y_2016), parseFloat(d[i].y_2015)
        ,parseFloat(d[i].y_2014), parseFloat(d[i].y_2013), parseFloat(d[i].y_2012)
        ,parseFloat(d[i].y_2011), parseFloat(d[i].y_2010), parseFloat(d[i].y_2009)
        ,parseFloat(d[i].y_2008), parseFloat(d[i].y_2007)]);
    }
    var width = 1440,height = 720;
    var title='十年内的GDP数据';
    var desc="中国各省份从2007到2016年" + title;
    var credits='by 孙平 - 2018';

    // DRAW 
    // create SVG map
    var projection = d3.geo.mercator()
        .center([90,42])
        .scale(780);
    
    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        //.attr("preserveAspectRatio", "xMidYMid")
        //.attr("viewBox", "0 0 " + width + " " + height);

    var path = d3.geo.path()
        .projection(projection);

    // BACKGROUND
    svg.append("g")
        .attr("class", "background")
        .append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "#ffffff")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", "0.35");

    // TITLE AND INFOS
    svg.append('g')
        .attr("class","info")
        .attr("transform", "translate(" + 540 + ","+ 20 +")")
        .append("rect")
        .attr({fill : "transparent", height: 40,width:200})

    svg.select('.info')
        .append("g")
        .attr("class", "title")
        .append("text")        
        .attr("transform", "translate(0,10)")
        .attr("dy", function(d){return 16})
        .attr("font-family", "sans-serif")
        .attr("fill", "#000000")
        .style("text-decoration", "bold")  
        .text(title)
        .attr("font-size", 24)
        .call(wrap, 150);

    svg.select('.info')
        .append("g")
        .attr("class","legend")
        .append("text")
        .attr("dx", 0)          
        .attr("dy", 60 )         
        .attr("font-family", "sans-serif")
        .attr("fill", "black")
        .attr("font-size", 12)
        .text(desc)
        .call(wrap, 150);

    svg.select('.info')
        .append("g")
        .attr("class","credits")
        .attr("transform", "translate(100,140)")
        .append("text")
        .attr("dx", 0)          
        .attr("dy", 0 )
        .attr("font-family", "sans-serif")
        .attr("fill", "black")
        .style("opacity",.7)
        .attr("font-size", 11)
        .text(credits)
        .call(wrap, 150);

    var year_info = svg.select(".info")
        .append("g")
        .attr("class","year_info")
        .attr("transform","translate(100,200)")
        .append("text")
        .attr("dx",0)
        .attr("dy",0)
        .attr("fill","black")
        .text("2016年GDP")

    //时间轴
    var rec = [2007,2008,2009,2010,2011,2012,2013,2014,2015,2016];
    var bars = svg.selectAll(".timeline")
        .data(rec)
        .enter()
        .append("g")
        .attr("class", "timeline")
        .attr("transform","translate(" + 340 + "," + 75  + ")")
                    
    bars.append("text")
        .text(function(d) {return d})
        .attr("x",function(d,i){
            return i * 60 + 75;
        })
        .attr("y", 598)
        .attr("fill","black")
        .attr("text-anchor", "middle")
        .attr("font-family","Tahoma");

    bars.append("rect")
        .attr("x",function(d,i){
            return i * 60 + 50;
        })
         .attr("y", 580)
        .attr("width",50)
        .attr("height",25)
        .attr("fill","transparent")
        .style("opacity", .5)
        .on("click",function(d,i) {
            d3.select(this)
                .attr("fill","green");
            drawProvinces(error,mainland,gdpdata,i,svg,path);
            year_info.text(2007+i+"年GDP")
        })
        .on("mouseout",function(d,i) {
            d3.select(this)
            .attr("fill","transparent");
        })

        //初始图为2016年数据      
        drawProvinces(error,mainland,gdpdata,0,svg,path);
}

//画每一个省的函数
function drawProvinces(error, cn,gdpdata,j,svg,path) {

    //从数据数组生成map
    var umap = []
    gdpdata.map(function(d) {umap[d[0]]=Number(d[10-j])});
    console.log(umap);

    var v = Object.keys(umap).map(function(k){return umap[k]})
    console.log(v);

    // COLORS
    // 定义颜色比例尺
    var linear = d3.scale.linear()
                .domain(d3.extent(v))
                .range([0,1]);
    var colorScale = d3.scale.linear()
               .domain([0,1])
               .interpolate(d3.interpolateHcl)
               //.range(["#B5CAA0", "#0D5661"]);
               //.range(["#81C7D4", "#0D5661"]);
               //.range(["#FB966E", "#C73E3A"]);
               .range(["#A5DEE4", "#E83015"]);

    // add grey color if no values
    var color = function(i){ 
        if (i==undefined) {return "#cccccc"}
        else return colorScale(linear(i));
    }

    //省份
    var province = svg.append("g")
        .attr("class", "map")
        .append("g")
        .attr("class", "mainland")
        .selectAll("path")
        .data(topojson.feature(cn, cn.objects.provinces).features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("id", function(d) { return d.id; })
        .attr("class", "province")
        .attr("fill", "#cccccc")
        .attr("fill", function(d) { return color(umap[d.properties.name]); })
        .attr("stroke", "black")
        .attr("stroke-width", "0.5")  //province stroke
    
    //生成颜色图例
    d3.select(".caption").remove();
    var caption = svg.append("g")
        .attr("class","caption")
    var init_caption = showcaption();
    

    //某省份十年内的数值
    var hist_w = 650,hist_h = 450;
    var padding = {left:30, right:30, top:20, bottom:20};

    //关闭图标用的buttom           
    var close_btm = d3.select("#close").append("svg")
                .attr("width",30)
                .attr("height",30)
                .style("display",'none')
                .style("opacity",.7)
                .on("click",function(d){          
                    //chart.style("display",'none')
                    d3.select("#MyChart").remove()
                    d3.select(this).style("display",'none')
                });

    var btm = close_btm.append("g").attr('id',"btm")
                .append("rect")
                .attr("width",20)
                .attr("height",20)
                .attr("fill","white")


    var btm_text = close_btm.append("text").text("X")
                .attr("x",5)
                .attr("y",5)
                .attr("dy",10)
                .attr("fill","red")
           
    province.on("mouseover",function(d,i) {
            d3.select("#tooltip").transition().duration(200).style("opacity", .9);
            d3.select("#tooltip").html(d.properties.name+ ' ' + umap[d.properties.name])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            d3.select(this)
                .attr("fill", "steelblue");
            })
            .on("mouseout",function(d,i) {
                d3.select("#tooltip").transition().duration(500).style("opacity", 0);
                d3.select(this)
                    .attr("fill", function(d) {
                        return color(umap[d.properties.name]);
                    });
            })
            .on("click",showchart);

    //点击省份生成其数据柱状图的函数
    function showchart(d) {
        
        var hist_w = 650,hist_h = 450;
        var padding = {left:30, right:30, top:20, bottom:20};
        //柱状图svg
        var chart = d3.select("#chart").append("svg")
                .attr("id","MyChart")
                .attr("width", hist_w + 200)
                .attr("height", hist_h + 200)


        //柱状图背景
        var hist_bg = chart.append("g").attr("id", "hist_bg")
                        .append("rect")
                        .attr("width", hist_w + 50)
                        .attr("height", hist_h + 20)
                        .attr("fill", "white")
                        .style("opacity", .7)

        //省份数据
        var chartdata = [];
        for(var i = 0; i < 31; i ++) {
            if (gdpdata[i][0] == d.properties.name) {
                for(var j = 1;j < 11;j++){
                    chartdata.push(gdpdata[i][j]);
                }
            }
        }
        chartdata.reverse();
        close_btm.style("display","block")

        //x轴的比例尺
        var xScale = d3.scale.ordinal()
            .domain(d3.range(chartdata.length))
            .rangeRoundBands([0, hist_w - padding.left - padding.right]);

        //y轴的比例尺
        var yScale = d3.scale.linear()
            .domain([0,d3.max(chartdata)])
            .range([hist_h - padding.top - padding.bottom, 0]);

        //定义x轴
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");
        
        //定义y轴
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        //矩形之间的空白
        var rectPadding = 4;   

        //矩形
        chart_rects = chart.selectAll(".MyRect")
            .data(chartdata)
            .enter()
            .append("rect")
            .attr("fill",function(i) {
                return "steelblue";
            })
            .style("opacity",.9)
            .attr("x", function(d,i){
                return 60 + xScale(i) + rectPadding/2;
            } )
            .attr("width",20)
            .attr("y",function(d){
                var min = yScale.domain()[0];
                return 20 + yScale(min);

            })
            .attr("height", function(d){
                return 0;
            })
            .transition()
            .delay(function(d,i){
                return i * 200;
            })
            .duration(2000)
            .ease("bounce")
            .attr("y",function(d){
                return 20 + yScale(d);
            })
            .attr("height",function(d) {
                return hist_h - padding.top - padding.bottom - yScale(d);
            })
            
        //数值文本
        chart_texts = chart.selectAll(".MyText")
            .data(chartdata)
            .enter()
            .append("text")
            .attr("fill","black")
            .attr("font-size",10)
            .style("opacity",1)
            .attr("x", function(d,i){
                return 60 + xScale(i) + rectPadding/2;
            } )
            .attr("y",function(d){
                var min = yScale.domain()[0];
                return yScale(min)-7;
            })
            .attr("dx",function(){
                return xScale.rangeBand()/2-35;
            })
            .attr("dy",function(d){
                return 20;
            })
            .text(function(d){
                return d;
            })
            .transition()
            .delay(function(d,i){
                return i * 200;
            })
            .duration(2000)
            .ease("bounce")
            .attr("y",function(d){
                return yScale(d)-7;
            })

        //x轴单位
        var year_text = chart.append("text")
            .text("年份")
            .attr("x",650)
            .attr("y",440)
            .attr("fill","black")
            .attr("font-size",14)

        //y轴单位
        var unit = "万元"
        var unit_text = chart.append("text")
            .text(unit)
            .attr("x",20)
            .attr("y",15)
            .attr("fill","black")
            .attr("font-size",14)  

        //添加x轴
        var chart_x = chart.append("g")
            .attr("class","axis")
            .attr("transform","translate(" + 45 + "," + (hist_h-20)  + ")")
            .call(xAxis)

        //添加y轴
        var chart_y = chart.append("g")
            .attr("class","axis")
            .attr("transform","translate(" + 45 + "," + 20 + ")")
            .call(yAxis);

    }

    // CAPTION
    // Color bar adapted from http://tributary.io/tributary/3650755/
    
    //颜色图例的函数
    function showcaption() {
         var units='Volume of tweets';
        var width = 1440,height = 720;
        caption.append("g")
            .attr("class","color-bar")
            .selectAll("rect")
            .data(d3.range(d3.min(v), d3.max(v), (d3.max(v)-d3.min(v))/50.0))
            .enter()
            .append("rect")
            .attr({width: 25,
                  height: 5,
                  y: function(d,i) { return height-75-i*5 },
                  x: width-450,
                  fill: function(d,i) { return color(d); } })

        caption.append("g")
            .attr("transform", "translate(" + (width-425) + "," + (height-75-5*49) + ")")
            .call(d3.svg.axis()
                   .scale(d3.scale.linear().domain(d3.extent(v)).range([5*50,0]))
                    .orient("right"))
            .attr("font-family", "sans-serif")
            .attr("fill", "#4B4B4B") //
            .attr("font-size", 10)

        caption.append("g")
            .attr("class","units")
            .attr("transform", "translate("+(width-435)+","+(height/2+15)+")")
            .append("text")
            .attr("dx", function(d){return 0})          
            .attr("dy", 9 )
            .attr("text-anchor", "middle")  
            .attr("font-family", "sans-serif")
            .attr("fill", "#4b4b4b")
            .attr("font-size", 10)
            .text(units)  //volumn of tweets
            .call(wrap, 50);
    }
}

//展示文本的函数
function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 0.7, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy );
        
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy ).text(word);
            }
        }
    });
}

//画线面积图的函数
function drawLineChart(error,d1,d2,d3_,d4,d5,d6,d7,d8,d9,d10) {
    //加载数据
    var province_name = [];
    for(var i = 0; i < 31; i++) {
        province_name.push(d1[i].province);
    }
    var m1=0,m2=0,m3=0,m4=0,m5=0,m6=0,m7=0,m8=0,m9=0,m10=0;
    //取每类的最大值
    for(var i = 0; i < 31; i++) {
        m1 = Math.max(d1[i].y_2015,m1)
        m2 = Math.max(d2[i].y_2015,m2)
        m3 = Math.max(d3_[i].y_2015,m3)
        m4 = Math.max(d4[i].y_2015,m4)
        m5 = Math.max(d5[i].y_2015,m5)
        m6 = Math.max(d6[i].y_2015,m6)
        m7 = Math.max(d7[i].y_2015,m7)
        m8 = Math.max(d8[i].y_2015,m8)
        m9 = Math.max(d9[i].y_2015,m9)
        m10 = Math.max(d10[i].y_2015,m10)
    }
    var gdp = [], rev = [], exp = [], idst = [],
        edu = [], eco = [], pay = [],
        pop = [], a_f = [], foreign = [];
    for(var i = 0; i < 31; i++) {
        gdp.push(d1[i].y_2015 / m1 * 0.9);
        rev.push(d2[i].y_2015 / m2 * 0.9);
        exp.push(d3_[i].y_2015 / m3 * 0.9);
        idst.push(d4[i].y_2015 / m4 * 0.9);
        edu.push(d5[i].y_2015 / m5 * 0.9);
        eco.push(d6[i].y_2015 / m6 * 0.9);
        pay.push(d7[i].y_2015 / m7 * 0.9);
        pop.push(d8[i].y_2015 / m8 * 0.9);
        a_f.push(d9[i].y_2015 / m9 * 0.9);
        foreign.push(d10[i].y_2015 / m10 * 0.9);
    }
    //config 包含data和options
    var config = {
        type: 'line',
        data: {
            labels: province_name,
            datasets: [
            {
                label: '地区生产总值',
                backgroundColor:"#CB4042",
                borderColor: "#CB4042",
                data: gdp,
                fill: false,
            },
            {
                label: '地区财政收入',
                backgroundColor: "#33A6B8",
                borderColor: "#33A6B8",
                data: rev,
                fill: false,
            },
            {
                label: '地区财政支出',
                backgroundColor: "#90B44B",
                borderColor: "#90B44B",
                data: exp,
                fill: false,
            },
            {
                label: '工业增加值',
                backgroundColor: "#0C4842",
                borderColor: "#0C4842",
                data: idst,
                fill: false,
            },
            {
                label: '教育经费',
                backgroundColor: "#FFC408",
                borderColor: "#FFC408",
                data: edu,
                fill: false,
            },
            {
                label: '金融业增加值',
                backgroundColor: "#66327C",
                borderColor: "#66327C",
                data: eco,
                fill: false,
            },
            {
                label: '居民人均可支配收入',
                backgroundColor: "#B481BB",
                borderColor: "#B481BB",
                data: pay,
                fill: false,
            },
            {
                label: '年末常住人口',
                backgroundColor: "#DCB879",
                borderColor: "#DCB879",
                data: pop,
                fill: false,
            },
            {
                label: '住宿餐饮业',
                backgroundColor: "#78C2C4",
                borderColor: "#78C2C4",
                data: a_f,
                fill: false,
            },
            {
                label: '外商投资进出口额',
                backgroundColor: "#8D742A",
                borderColor: "#8D742A",
                data: foreign,
                fill: false,
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: '全国各省份与GDP相关的9种数据线面积图'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: '省份'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: '大小比例'
                    }
                }]
            }
        }
    };
    var ctx = document.getElementById('canvas').getContext('2d');
    var myLine = new Chart(ctx, config);
}
