/*  -------------------------------------------------------------------------   */
/**
 * Method used to get data and styles from Json files.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */

function getDataAndStyles() {
    var chartDataAssigned = $.Deferred();
    var chartStyleAssigned = $.Deferred();
    var parsedData, parsedStyle;
    $.post("json/data.json", function (data) {
        parsedData = data;
        chartDataAssigned.resolve();
    });
    $.post("json/style.json", function (data) {
        parsedStyle = data;
        chartStyleAssigned.resolve();
    });

    var necessaryDataAssigned = $.when(chartDataAssigned, chartStyleAssigned).done(function () {
        chartInitParams = {
            Data: parsedData,
            Style: parsedStyle

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

function BarChart(chartInitParams) {
    this.parsedData = chartInitParams.Data;
    this.parsedStyle = chartInitParams.Style;
    this.xTicksize = 6.5;
    this.margin = {left: 20, right: 40, top: 0, bottom: 10};
    this.legendsClick = false;

    //Defining styles for value axis
    var valueAxisStyle = this.parsedStyle.Axis.valueAxis;
    this.valueAxisColor = valueAxisStyle.color;
    this.valueAxisFontSize = valueAxisStyle.fontSize;
    this.valueAxisShowAxis = valueAxisStyle.showAxis;
    this.valueAxisStrokeColor = valueAxisStyle.strokeColor;
    this.valueAxisStrokeWeight = valueAxisStyle.weight;
    this.valueAxistittle = valueAxisStyle.tittle;
    this.valueAxisFontFamily = valueAxisStyle.fontFamily;

    //Defining styles for category axis
    var categoryAxisStyle = this.parsedStyle.Axis.categoryAxis;
    this.categoryAxisColor = categoryAxisStyle.color;
    this.categoryAxisFontSize = categoryAxisStyle.fontSize;
    this.categoryAxisShowAxis = categoryAxisStyle.showAxis;
    this.categoryAxisStrokeColor = categoryAxisStyle.strokeColor;
    this.categoryAxisStrokeWeight = categoryAxisStyle.weight;
    this.categoryAxistittle = categoryAxisStyle.tittle;
    this.categoryAxisFontFamily = categoryAxisStyle.fontFamily;
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

    this.originalData = $.extend(true, [], this.parsedData.Data);
    this.axisFlag = false;
    this.saveClick = false;
    this.originalData = this.addingAttribute(this.originalData);
    handlingSeriesColors(this);
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
BarChart.prototype.spliceData = function () {

    var that = this;
    if (that.legendsClick) {
        that.finalGraphData = that.legendSelectData;
    }
    else if(!that.saveClick)
        that.finalGraphData = that.originalData;


    that.xScale = d3.scale.linear();
    /*  defining the scale for value axis */
    that.yScale = d3.scale.ordinal();
    that.barScale = d3.scale.ordinal();


    that.valueAxisMaxVal = d3.max(that.finalGraphData.filter(function (ele) {
        return ele.active;
    }), function (c) {
        return d3.max(c["data"], function (d) {
            return d["value"];
        });
    });

    that.valueAxisMinVal = d3.min(that.finalGraphData.filter(function (ele) {
        return ele.active;
    }), function (c) {
        return d3.min(c["data"], function (d) {
            return d["value"];
        });
    });

    if (that.valueAxisMinVal > 0) {
        that.valueAxisMinVal = 0;
    }
//    console.log(that.valueAxisMinVal, that.valueAxisMaxVal)
    if (!that.legendsClick) {
        calculateMargin(that);
        calculateLegendHeight(that);
    }
    that.legendHeight = calculateLegendHeight(that);

    that.margin.bottom = that.margin.bottom + that.legendHeight;
    that.actualChartingAreaWidth = that.chartingAreaWidth;
    that.actualChartingAreaHeight = that.chartingAreaHeight;

    /*  calculate the svg height and width  */
    that.width = that.actualChartingAreaWidth - that.margin.right;
    that.height = that.actualChartingAreaHeight - that.margin.bottom;
    /*  defining the scale for x-axis  */
    that.xScale = d3.scale.linear();
    /*  setting the domain for x-axis and y-axis */
    that.yScale.domain(that.finalGraphData[0].data.map(function (d, i) {
        return d.label;
    })).rangeBands([that.height, that.categoryAxisStrokeWeight / 2], 0.2);

    that.barScale.domain(that.finalGraphData.filter(function (ele) {
        return ele.active === true;
    }
    ).map(function (d, i) {
        return i;
    })).rangeRoundBands([0, that.yScale.rangeBand()]);

    that.xScale.domain([that.valueAxisMinVal, that.valueAxisMaxVal])
            .range([0, that.width - that.margin.left - that.margin.right])

}

/* Method call for drop labels Y-axis*/

/*  -------------------------------------------------------------------------   */
/**
 * Method used to render the chart.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */

BarChart.prototype.render = function () {
    var that = this;

    if (!that.legendsClick) {
        that.renderLegend();

    }
    if(!that.saveClick){
    that.addingDataTable(that);
    editData(that);
    }
    that.chartingAreaStyle(that);
    that.setActualChartingAreaStyle(that);
    that.renderValueAxis(that);
    that.renderLabelAxis(that);
    that.renderBarSeries(that);
    that.ChangeMinAndMaxValues(that);
    
    that.ChangeScale(that);
    saveClick(that);
}

/*  -------------------------------------------------------------------------   */
/**
 * Method used to apply styles for the charting Area
 *
 * @version   0.0.1that.renderValueAxis(that);
 that.renderLabelAxis(that);
 * @since     0.0.1
 * @access    public
 * @author    
 */

BarChart.prototype.chartingAreaStyle = function (that) {
    /*  styling the charting area/graph container  */
    d3.select('.chart').style({
        'background-color': that.chartingAreaBackgroundColor,
        'height': that.chartingAreaHeight + "px",
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
 * Method used to append and apply styles for the actual charting area.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
BarChart.prototype.setActualChartingAreaStyle = function (that) {
    that.actualChartArea = d3.select('.chart').append("div").classed("actualChartPane", true).style({
        'background-color': function () {
            return that.chartingAreaBackgroundColor;
        },
        'height': that.chartingAreaHeight + "px",
        'width': that.chartingAreaWidth + "px",
        'border': that.chartingAreaBorderThickness + "px solid " + that.chartingAreaBorderColor,
    })

    that.svg = that.actualChartArea.append("svg")
            .attr("width", that.actualChartingAreaWidth)
            .attr("height", that.actualChartingAreaHeight);

    /*  append a svg element */
    that.svg = that.svg.append("g").attr('class', 'tool').attr("transform", function (d) {
            return "translate(" + that.margin.left + "," + that.margin.top + ")";  
    });

}
/*  -------------------------------------------------------------------------   */
/**
 * Method used to render value axis.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
BarChart.prototype.renderValueAxis = function (that) {
    var valueAxis = d3.svg.axis()
            .scale(that.xScale)
            .orient("bottom")
            .innerTickSize(-that.actualChartingAreaHeight)
            .outerTickSize(0)
            .tickPadding(10);
    that.svg.append("g")
            .attr("class", "valueAxis")
    that.svg.append("g")
            .attr("class", "valueAxis")
            .attr("transform", "translate(0," + (parseInt(that.height) - parseInt(that.valueAxisStrokeWeight) / 2) + ")")
            .attr("fill", "none")
            .attr("stroke", that.valueAxisStrokeColor)
            .attr("stroke-width", that.valueAxisStrokeWeight)
            .style("color", that.valueAxisColor)
            .call(valueAxis)
            .append("text")
            .attr("class", "xaxis-title")
            .attr("x", that.actualChartingAreaWidth / 2 - 80)
            .attr("y", that.actualChartingAreaHeight / 10)
            .style("text-anchor", "middle")
            .style("stroke", "green")
            .text(that.valueAxistittle);
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
BarChart.prototype.renderLabelAxis = function (that) {
    var categoryAxis = d3.svg.axis()
            .scale(that.yScale)
            .orient("left")

    that.svg.append("g")
            .attr("class", "labelAxis")
            .attr("fill", "none")
            .attr("stroke", that.categoryAxisStrokeColor)
            .attr("stroke-width", that.categoryAxisStrokeWidth)
            .style("color", that.categoryAxisColor)
            .call(categoryAxis)
            .append("text")
            .attr("class", "yaxis-title")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - that.margin.left)
            .attr("x", 0 - (that.actualChartingAreaHeight / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("stroke", "green")
            .text(that.categoryAxistittle);

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

    var seriesSection = that.svg.selectAll("g.seriesGroup").data(that.finalGraphData
            .filter(function (ele) {
                return ele.active === true;
            })
            )
            .enter().append("svg:g").attr("class", function (d) {
        return d.series;
    });
    var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d, i, j) {
                return "<strong></strong> <span style='color:blue'>" + d.value + "</span>";
            });

    seriesSection.call(tip);
    var section = seriesSection.selectAll("g.section").data(function (d, i) {

        return d.data;
    }).enter().append("svg:g").attr("transform", function (d, i) {
        return "translate(0, " + that.yScale(d.label) + ")";
    })
            .style("fill", function (d, i, j) {
            if(that.seriesData[d.index] == undefined)
            return that.colors(d.index);
                return that.seriesData[d.index].color

            })

            .selectAll("rect")
            .data(function (d) {
                return [d];
            })
            .enter().append("rect")
            .attr("width", function (d, i) {
                if(d.value == 0){
                    return 0;
                }
                return that.xScale(d.value)
            })
            .attr("height", that.barScale.rangeBand())
            .attr("x", function (d, i, j) {
            if(d.value > (that.valueAxisMinVal)){
                    return 0;
             }
                return that.xScale(i);
            })
            .attr("y", function (d, i, j) {
                var j = Math.floor(j / (that.finalGraphData[0].data).length);

                return that.barScale(j);
            })
            .on('mouseover', tip.show)
            .on('mouseout', function () {
                d3.select(".d3-tip")
                        .transition()
                        .delay(200)
                        .duration(500)
                        .style("opacity", 0);
                tip.hide;
            });

}
;
/**  -------------------------------------------------------------------------   **/
/**
 * Method used to render legends.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */

BarChart.prototype.renderLegend = function () {
    var that = this;
    var legendContainer = d3.select('.chart').append("div")
            .attr("class", "legendContainer")
            .attr("width", that.actualChartingAreaWidth)
            .attr("height", "50px")
            .style("text-align", "left");

    var legend = legendContainer.selectAll(".legendContainer")

            .data(that.finalGraphData)
            .enter()
            .append("div")
            .attr("class", "series")
            .attr("id", function (d) {
                return d.series;
            })
            .style("display", "inline-flex")
            .style("padding", "5px");
    legend.append("div")
            .attr("class", "colorBox")
            .style("background-color", function (d, i) {
                if(that.seriesData[i] == undefined)
            return that.colors(i);
                return that.seriesData[i].color;
            })
            .style("width", "15px")
            .style("height", "15px")
            .style("margin-right", "5px")
            .style("margin-left", "10px");

    legend.append("tspan")
            .text(function (d, i) {
                if(that.seriesData[i] == undefined)
                return that.finalGraphData[i].series;
                return that.seriesData[i].name;
            })
    legendsClick(that);
};
/**  -------------------------------------------------------------------------   **/
/**
 * Method used to toggle the active class for series and calls the update chart function.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
function legendsClick(that) {
    $('.colorBox').click(function () {
        $(this).parent().toggleClass('active');
        updateChart(that);
    })
}

/**  -------------------------------------------------------------------------   **/
/**
 * Method used to get the dimensions of the text.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */

function getTextDimensions(fontsize, fontfamily, text) {
    var svgTemp = d3.select("body")
            .append("svg:svg")
            .style("opacity", 0)
            .attr('id', 'svgTemp');

    var textTemp = svgTemp.append("svg:text")
            .attr("x", -500)
            .attr("y", 20)
            .style("font-size", fontsize + "px")
            .style("font-family", fontfamily)
            .text(text);
    var textDimensions = textTemp.node().getBBox();
    $('#svgTemp').remove();
    return textDimensions;
}


/**  -------------------------------------------------------------------------   **/
/**
 * Method used to calculate height for the legends in chart.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
function calculateLegendHeight(that) {
    var legendMargin = 20, padding = 10, colorBoxWidth = 15;
    var columnHeight = 0;
    var columnWidth = 0;
    var legendWidth = that.actualChartingAreaWidth;
    var legendLengthArray = [];
    for (var i = 0; i < that.finalGraphData.length; i++) {
        if(that.seriesData[i] == undefined){
            var legendName = that.finalGraphData[i].series;
        }
        else{
            var legendName = that.seriesData[i].name;
        }
        columnHeight = parseFloat(getTextDimensions(that.chartLegendFontSize, that.chartLegendFontFamily, legendName).height) + padding;
        columnWidth += padding + colorBoxWidth + parseFloat(Math.floor(getTextDimensions(that.chartLegendFontSize, that.chartLegendFontFamily, legendName).width));
        var widthTemp = legendMargin + colorBoxWidth + parseFloat(Math.floor(getTextDimensions(that.chartLegendFontSize, that.chartLegendFontFamily, legendName).width));
        legendLengthArray.push(widthTemp);
    }
    legendLengthArray.max = function () {
        return Math.max.apply(Math, this);
    };
    /* Calculating the columns for legend */
    that.legendColumn = (Math.round(legendWidth / legendLengthArray.max()) > 1) ? Math.floor(legendWidth / legendLengthArray.max()) : 1;
    var legendDataLength = that.finalGraphData.length;
    var rows = legendDataLength / that.legendColumn;
    var totalRowsHeight = columnHeight * rows;
    return totalRowsHeight;
}

/**  -------------------------------------------------------------------------   **/
/**
 * Method used to update the chart when clicked on legends.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */

function updateChart(that) {
    that.legendsClick = true;
    var legendData = that.parsedData.Data;
    that.legendSelectData = [];
    $(' div .series').each(function (i, j) {
        if ($(this).hasClass('active')) {
            /* since some series is deselected using legend selector, setting the legendFlag */
            that.legendSelectData.push({
                series: legendData[i].series,
                data: legendData[i].data,
                active: false
            });
        } else {
            that.legendSelectData.push({
                series: legendData[i].series,
                data: legendData[i].data,
                active: true
            });
        }
    });

    that.legendSelectData = that.addingAttribute(that.legendSelectData);
    $('.actualChartPane').remove();
    that.spliceData();
    that.render();
}

/*  -------------------------------------------------------------------------   */
/**
 * Method used to add attributes in the data which will be helpful for updating the chart after legends click
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
BarChart.prototype.addingAttribute = function (data) {
    var that = this;
    /*Adding required attributes on the data for legends show/hide */
    var data = $.each(data, function (key, value) {
        if (value.active === undefined)
            value.active = true;
        $.each(value.data, function (k, v) {
            v.index = key;
        })
    });
    return data;

}
/*  -------------------------------------------------------------------------   */
/**
 * Method used to provide the padding to the svg to wrap the long text in the label axis.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */

function calculateMargin(that) {
    var extraPadding = 20;
    var LabelDimensions = [];
    $.each(that.finalGraphData, function (key, value) {
        $.each(value.data, function (k, v) {
            if (key === 0) {
                LabelDimensions.push(getTextDimensions(that.categoryAxisFontSize, 'Arial', v.label).width)
            }
        })
    });
    var maxWidth = d3.max(LabelDimensions) + extraPadding;
    var maxTickValueDimensions = getTextDimensions(that.valueAxisFontSize, 'Arial', that.valueAxisMaxVal.toString());
    that.margin.right = maxTickValueDimensions.width / 2;
    that.margin.left = maxWidth+that.xTicksize;
    that.margin.bottom = 3 * parseFloat(maxTickValueDimensions.height)+that.xTicksize;
}

/*  -------------------------------------------------------------------------   */
/**
 * Method used to handle series colors if the series colors are empty or not specified.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
function handlingSeriesColors(that) {
    that.colors = d3.scale.category20();
    for (var i = 0; i < that.originalData.length; i++) {
        if (that.seriesData[i] == undefined) {
            that.seriesData[i] = {};
            that.seriesData[i].name = that.originalData[i].series;
            that.seriesData[i].color = that.colors(i);
        }
    }
}
/*  -------------------------------------------------------------------------   */
/**
 * Method used to design table to display data .
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */

BarChart.prototype.addingDataTable = function (that) {
    var m = "<tr>";

    that.finalGraphData[0].data.forEach(function (d) {
        m = m + '<td><input type="text" disabled="true" class="label-row" value=' + d.label + "></td>";
    });

    m = m + "</tr>";

    that.finalGraphData.forEach(function (d) {

        d.data.forEach(function (d) {
            m = m + '<td><input type="text" disabled="true" class="value-row" value=' + d.value + "></td>";
        });

        m = m + "</tr>";

    });
   d3.select(".data-table").append("table").html(m);
};
/*  -------------------------------------------------------------------------   */
/**
 * Method used to rerender the chart according to manipulated data. .
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
BarChart.prototype.reRenderChart = function (that) {
    var Data = [];
    var labels = [];
    var updatedData = [];
    
//looping over the table data elements to get the updated data values
    $('.data-table table tbody tr td').each(function (k, v) {
        if((parseFloat($(this).find('input[type = text]').val())) == ''){
            $(this).find('input[type = text]').val(0);
        }
        else if (!isNaN(parseFloat($(this).find('input[type = text]').val()))) {
            Data.push($(this).find('input[type = text]').val());
        }
        else{
            labels.push($(this).find('input[type = text]').val());
        }
        
    });
//Arranging the data in the way for updating with graphData
    $.each(Data, function (key, value) {
        var val = Math.floor(key / ($(".data-table tr:eq(2) td").length));
        var index= Math.floor(key%($(".data-table tr:eq(2) td").length));
        if (updatedData[val] == undefined) {
            updatedData[val] = {};
            updatedData[val]['data'] = [];
            updatedData[val]['series'] = 'series'+(val+1);
        }
        updatedData[val]['data'][index] = {};
        updatedData[val]['data'][index]['value'] = value;
        updatedData[val]['data'][index]['label'] = labels[index]
    });
    that.addingAttribute(updatedData);
    that.finalGraphData = updatedData;
};

/*  -------------------------------------------------------------------------   */
/**
 * Method used to call when user clicked on save button.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
function saveClick(that) {
   that.saveClick = true;
    $(".save-data").click(function () {
        that.reRenderChart(that);
       $('.actualChartPane').remove();
       $('.legendContainer').remove();
        that.spliceData();
        that.render(that);
       
           
       })
}
/*  -------------------------------------------------------------------------   */
/**
 * Method used to call when user clicked on edit button.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
function editData(that) {
    $(".edit-values").click(function () {
        $(".series-row").attr("disabled", false);
        $(".label-row").attr("disabled", false);
        $(".value-row").attr("disabled", false);
    })
 
    $(".series-add").on("click", function () {console.log('i am on add series')
        that.AddSeries(that);
    })
    $(".label-add").on("click", function () {console.log('i am on add labels')
        that.AddLabels(that);
    });
}

/*  -------------------------------------------------------------------------   */
/**
 * Method used to change min and max values when user changes
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
BarChart.prototype.ChangeMinAndMaxValues = function (that) {
     that.min = that.valueAxisMinVal;
     that.max = that.valueAxisMaxVal;
    
    $(".x-min").change(function () {
         that.min = ($(".x-min").val());
         that.max = ($(".x-max").val());
        var actualData = [];

        if (that.max === '') {
            that.max = that.valueAxisMaxVal;
        }
        if (that.min === '') {
            that.min = that.valueAxisMinVal;
        }
        that.changeAxis(that);
        }); 
        
        $(".x-max").change(function () {
         that.min = ($(".x-min").val());
         that.max = ($(".x-max").val());
        var actualData = [];

        if (that.max === '') {
            that.max = that.valueAxisMaxVal;
        }
        if (that.min === '') {
            that.min = that.valueAxisMinVal;
        }
        that.changeAxis(that);
        });    
}
/*  -------------------------------------------------------------------------   */
/**
 * Method used to cha.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
BarChart.prototype.changeAxis = function(that){
    $.each(that.finalGraphData, function (key, value) {
            $.each(value.data, function (k, v) {
                if (v.value >= parseFloat(that.min) && v.value <= parseFloat(that.max)) {
                    v.value =  v.value
                }
                else{
                    v.value =  0;
                }
            })
        });
        that.valueAxisMinVal = that.min;
        that.valueAxisMaxVal = that.max;
        that.xScale.domain([that.valueAxisMinVal, that.valueAxisMaxVal])
                .range([0, that.width - that.margin.left - that.margin.right]);
        $('.valueAxis').remove();
        $.each(that.finalGraphData,function(k,v){
            $('.series'+(k+1)).remove();
        })
        that.renderValueAxis(that);
        that.renderBarSeries(that);
}

/*  -------------------------------------------------------------------------   */
/**
 * Method used to add the series in the chart.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
BarChart.prototype.AddSeries = function (that) {
    var noOfData = $(".data-table tr:eq(2) td").length;
    z = "";
    for (var i = 0; i < noOfData; i++) {
        z += "<td><input type = 'text' value=''></td>";
    }
    d3.select(".data-table table tbody").append("tr").html(z);

   saveClick(that);

}
/*  -------------------------------------------------------------------------   */
/**
 * Method used to add the labels in the chart.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
BarChart.prototype.AddLabels = function (that) {
    var labelsData = [];
    var updatedData = {};
    d3.selectAll(".data-table tr")
            .append("td")
            .append("input")
            .attr("type", "text")
            .attr("value", '');
   saveClick(that);


}
/*  -------------------------------------------------------------------------   */
/**
 * Method used to change the scale of value axis.
 *
 * @version   0.0.1
 * @since     0.0.1
 * @access    public
 * @author    
 */
BarChart.prototype.ChangeScale = function (that) {
    $(".scale-selection").change(function () {
        optionScale = $(this).find('option:selected').val();
        that.svg.selectAll(".valueAxis .tick").each(function (data) {
            var tick = d3.select(this);
            if (that.valueAxisMinVal < 1) {
                that.valueAxisMinVal = 0.1;
            }
            if (optionScale === "Lograthmic") {

                that.xScale = d3.scale.log().clamp(true);

                that.xScale.domain([that.valueAxisMinVal, that.valueAxisMaxVal])
                        .range([0, that.width - that.margin.left - that.margin.right]);
            }
        });
        if (optionScale === "linear") {
            that.valueAxisMinVal = 0;
            that.xScale = d3.scale.linear();
            that.xScale.domain([that.valueAxisMinVal, that.valueAxisMaxVal])
                    .range([0, that.width - that.margin.left - that.margin.right]);
            //console.log(that.valueAxisMinVal, that.valueAxisMaxVal);
        }
        $(".valueAxis").remove();
        $.each(that.finalGraphData,function(k,v){
        $('.series'+(k+1)).remove();
        })
        that.renderValueAxis(that);
        that.renderBarSeries(that);
    });
};

