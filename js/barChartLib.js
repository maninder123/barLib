/*  -------------------------------------------------------------------------   */
/**
 * Method used to get data and styles from Json files.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */

function getDataAndStyles(){
    var chartDataAssigned = $.Deferred();
    var chartStyleAssigned = $.Deferred();
    var parsedData,parsedStyle;
   $.post( "json/data.json", function(data) {
            parsedData = data;
            chartDataAssigned.resolve();
});
   $.post( "json/style.json", function(data) {
            parsedStyle = data;
            chartStyleAssigned.resolve();
});

var necessaryDataAssigned = $.when(chartDataAssigned, chartStyleAssigned).done(function() {
     chartInitParams = {
        Data:parsedData,
        Style:parsedStyle
        
    }
var graphHandle = new BarChart(chartInitParams);
graphHandle.render();
})
}

getDataAndStyles();


/*  -------------------------------------------------------------------------   */
/**
 * Method used to initialize variables.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */

function BarChart(chartInitParams){
  this.parsedData = chartInitParams.Data;
  this.parsedStyle = chartInitParams.Style;
  this.padding ={left:80,right:40,top:20,bottom:30}


    //Defining styles for value axis
  var valueAxisStyle = this.parsedStyle.Axis.valueAxis;
  this.valueAxisColor = valueAxisStyle.color;
  this.valueAxisFontSize = valueAxisStyle.fontSize;
  this.valueAxisShowAxis = valueAxisStyle.showAxis;
  this.valueAxisStrokeColor = valueAxisStyle.strokeColor;
  this.valueAxisStrokeWeight = valueAxisStyle.weight;
  
  //Defining styles for category axis
  var categoryAxisStyle = this.parsedStyle.Axis.categoryAxis;
  this.categoryAxisColor = categoryAxisStyle.color;
  this.categoryAxisFontSize = categoryAxisStyle.fontSize;
  this.categoryAxisShowAxis = categoryAxisStyle.showAxis;
  this.categoryAxisStrokeColor = categoryAxisStyle.strokeColor;
  this.categoryAxisStrokeWeight = categoryAxisStyle.weight;
  
  //Defining seriesData Styles
  this.seriesData = this.parsedStyle.SeriesStyles;
  
  //Defining styles for charting Area
  var chartingAreaStyle = this.parsedStyle.chartingAreaStyle;
  this.chartingAreaBackgroundColor = chartingAreaStyle.backgroundColor;
  this.chartingAreaBorderColor = chartingAreaStyle.borderColor;
  this.chartingAreaBorderThickness = chartingAreaStyle.borderThickness;
  this.chartingAreaXPosition = chartingAreaStyle.chartComponentPositionX;
  this.chartingAreaYPosition = chartingAreaStyle.chartComponentPositionY;
  this.chartingAreaIsVisible = chartingAreaStyle.chartComponentIsVisible;
  this.chartingAreaHeight = chartingAreaStyle.chartComponentHeight;
  this.chartingAreaWidth = chartingAreaStyle.chartComponentWidth;
  
  //Defining grid line style
  var gridLineStyle = this.parsedStyle.gridStyle;
  this.horizontalLineStrokeColor = gridLineStyle.hLineStrokecolor;
  this.horizontalLineThickness = gridLineStyle.hLineThickness;
  this.IsGridLineVisible = gridLineStyle.isGridlineVisible;
  this.verticalLineStrokeColor = gridLineStyle.vLineStrokeColor;
  this.verticalLineThickness = gridLineStyle.vLineThickness;
  
  //Defining legend styles
  var legendStyles = this.parsedStyle.legendStyles;
  this.chartLegendFontSize = legendStyles.fontSize;
  this.chartLegendFontFamily = legendStyles.fontFamily;
  this.chartLegendFontStyle = legendStyles.fontStyle;
  this.chartLegendFontWeight = legendStyles.fontWeight;
  
  this.spliceData();
}

/*  -------------------------------------------------------------------------   */
/**
 * Method used to define scales and values required for the chart.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
BarChart.prototype.spliceData = function() {
    var that = this;
     
     that.finalGraphData = this.parsedData;
     
         /*  defining the scale for x-axis  */
    that.xScale = d3.scale.linear();

    /*  defining the scale for value axis */
    that.yScale = d3.scale.ordinal();
    that.barScale = d3.scale.ordinal();

    var valueArray = [];
 $.each(that.finalGraphData.Data,function(key,value){
    $.each(value.data,function(k,v){
           valueArray.push(v.value);
    })
});
 that.valueAxisMinVal = d3.min(valueArray);
 that.valueAxisMaxVal = d3.max(valueArray);

if(that.valueAxisMinVal > 0){
    that.valueAxisMinVal = 0;
}

that.actualChartingAreaWidth = that.chartingAreaWidth;
that.actualChartingAreaHeight = that.chartingAreaHeight;

   /*  calculate the svg height and width  */
    that.width = that.actualChartingAreaWidth - that.padding.left - that.padding.right;
    that.height = that.actualChartingAreaHeight - that.padding.top - that.padding.bottom;
 /*  defining the scale for x-axis  */
    that.xScale = d3.scale.linear();

    /*  defining the scale for value axis */
    that.yScale = d3.scale.ordinal();
    that.barScale = d3.scale.ordinal();

  /*  setting the domain for x-axis and y-axis */
    that.yScale.domain(that.finalGraphData["Data"][0].data.map(function(d, i) {
        return d.label;
    })).rangeBands([that.height, that.categoryAxisStrokeWeight / 2], 0.2);

    that.barScale.domain(that.finalGraphData["Data"].map(function(d, i) {
        return i;
    })).rangeRoundBands([0, that.yScale.rangeBand()]);
    that.xScale.domain([that.valueAxisMinVal, that.valueAxisMaxVal]).range([0, that.width -that.padding.left -that.padding.right]);
    /* Method call for drop labels Y-axis*/
}

/*  -------------------------------------------------------------------------   */
/**
 * Method used to render the chart.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */

BarChart.prototype.render = function(){
    var that = this;
        that.chartingAreaStyle(that);
        that.setActualChartingAreaStyle(that);
        that.renderValueAxis(that);
        that.renderLabelAxis(that);
        that.renderBarSeries(that);
    
}

/*  -------------------------------------------------------------------------   */
/**
 * Method used to get data and styles from Json files.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */

BarChart.prototype.chartingAreaStyle = function(that){
   /*  styling the charting area/graph container  */
    d3.select('.chart').style({
        'background-color': that.chartingAreaBackgroundColor,
        'height': that.chartingAreaHeight +"px",
        'width': that.chartingAreaWidth + "px",
        'border': that.chartingAreaBorderThickness + "px solid " + that.chartingAreaBorderColor,
            'left': that.chartingAreaXPosition + "px",
        'top': that.chartingAreaYPosition + "px",
        'overflow': 'hidden',
        'position': 'absolute'
    });
}


/*  -------------------------------------------------------------------------   */
/**
 * Method used to get data and styles from Json files.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
BarChart.prototype.setActualChartingAreaStyle = function(that){
    that.actualChartArea = d3.select('.chart').append("div").classed("actualChartPane", true).style({
        'background-color': function () {
            return that.chartingAreaBackgroundColor;
        },
       'height': that.chartingAreaHeight +"px",
        'width': that.chartingAreaWidth + "px",
        'border': that.chartingAreaBorderThickness + "px solid " + that.chartingAreaBorderColor,
})

    that.svg = that.actualChartArea.append("svg")
        .attr("width", that.actualChartingAreaWidth)
        .attr("height",that.actualChartingAreaHeight)
        .style("padding-top",that.padding.top+'px')
        .style("padding-right",that.padding.right +'px')
        .style("padding-bottom",that.padding.bottom +'px')
        .style("padding-left",that.padding.left + 'px');
}


/*  -------------------------------------------------------------------------   */
/**
 * Method used to value axis.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
BarChart.prototype.renderValueAxis = function(that){
    
    var valueAxis = d3.svg.axis()
    .scale(that.xScale)
    .orient("bottom");
    
    that.svg.append("g")
    .attr("class", "value Axis")
    .attr("transform", "translate(0," + (parseInt(that.height) - parseInt(that.valueAxisStrokeWeight) / 2) + ")")
    .attr("fill","none")
    .attr("stroke",that.valueAxisStrokeColor)
    .attr("stroke-width", that.valueAxisStrokeWeight)
    .call(valueAxis);
}

/*  -------------------------------------------------------------------------   */
/**
 * Method used to render Label Axis.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
BarChart.prototype.renderLabelAxis = function(that){
    var categoryAxis = d3.svg.axis()
            .scale(that.yScale)
            .orient("left")
    
    that.svg.append("g")
            .attr("class","labelAxis")
            .attr("fill","none")
            .attr("stroke",that.categoryAxisStrokeColor)
            .attr("stroke-width",that.categoryAxisStrokeWidth)
            .call(categoryAxis)
}

/*  -------------------------------------------------------------------------   */
/**
 * Method used to render bars.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
BarChart.prototype.renderBarSeries = function (that) {
    var seriesSection = that.svg.selectAll("g.seriesGroup").data(that.finalGraphData["Data"])
            .enter().append("svg:g").attr("class", "sereiesGroup");

    var section = seriesSection.selectAll("g.section").data(function (d, i) {
        return d.data;
    }).enter().append("svg:g").attr("transform", function (d, i) {
        return "translate(0, " + that.yScale(d.label) + ")";
    })
            .style("fill", function (d, i, j) {
                return that.seriesData[j].color
            })
            .selectAll("rect")
            .data(function (d) {
                return [d];
            })
            .enter().append("rect")
            .attr("width", function (d, i) {
                return that.xScale(d.value)
            })
            .attr("height", that.barScale.rangeBand())
            .attr("x", function (d, i, j) {
                return that.xScale(i);
            })
            .attr("y", function (d, i, j) {
                var j = Math.floor(j / (that.finalGraphData["Data"][0].data).length);
                return that.barScale(j);
            })

}