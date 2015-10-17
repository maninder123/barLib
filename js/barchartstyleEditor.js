$(document).ready(function () {         // Loading the page
    
    //Calling of the functions created //
    
    labelAxisStyle();
    valueAxisStyle();
    GridAxisStyle();
    BarColorStyle();
    legendStyle();
//    wraptext();
    
    //To change the color of the axis//
    $('.axis-style').on('changeColor.colorpicker', function (event) {    // to change the color of the axis.  
        $("path").css({'stroke': event.color.toHex()});
    });
    $('.module-color').on('changeColor.colorpicker', function (event) {    // to change the color of the axis.  
        $(".actualChartPane").css({'background-color': event.color.toHex()});
    });
});

//Method to change the style of Label Axis//

function labelAxisStyle() {

    $(document).on("click", ".y-off", function () {
        $(".labelAxis").hide();
    });
    $(document).on("click", ".y-on", function () {
        $(".labelAxis").show();
    });
    $(".y-tittle").keyup(function () {
        var yt = $(".y-tittle").val();
        $('.yaxis-title').html(yt);
    });
}
;

//Method to change the style of value Axis//

function valueAxisStyle() {

    $(document).on("click", ".x-off", function () {
        $(".valueAxis").hide();
    });
    $(document).on("click", ".x-on", function () {
        $(".valueAxis").show();
    });
    $(".x-tittle").keyup(function () {
        var xt = $(".x-tittle").val();
        $('.xaxis-title').html(xt);
    });
}
;
//Method for styling Grid//   

function GridAxisStyle() {
    $(".grid-thickness").change(function () {
        $(".tick line").css({'opacity': $(this).val() + ''});
    });
    $(document).on("click", ".grid-off", function () {
        $(".tick line").hide();
    });
    $(document).on("click", ".grid-on", function () {
        $(".tick line").show();
    });
}
;
//Method for styling the bar and their corresponding legend//

function BarColorStyle() {
    $.getJSON("json/data.json", function (data) {
        $.each(data.Data, function (d, i) {
            con = '<option value=' + data.Data[d].series + '>' + data.Data[d].series + '</option>';
            $(".series-color").append(con);
            $(".series-color").change(function () {
                option = $(this).find('option:selected').val();
            });
            $(".bar-color").change(function () {
                $("." + option, "").children("g").css({'fill': $(this).val() + ''});
                 $("#" + option, "").children(".colorBox").css({'background-color': $(this).val() + ''});
            });
        });
    });
}
;

// Method to display the legend//

function legendStyle() {
    $(document).on("click", ".off", function () {
        $('.legendContainer').hide();
    });
    $(document).on("click", ".on", function () {
        $('.legendContainer').show();
    });
}
;











