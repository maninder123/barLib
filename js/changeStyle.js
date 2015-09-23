$(document).ready(function () {
    labelAxisStyle();
    valueAxisStyle();
GridAxisStyle();
});

//Method to change the style of Label Axis//

function labelAxisStyle() {
    $(".font_size").change(function () {
        $(".labelAxis text").css({'font-size': $(this).val() + 'px'});
    });
    $(".axisfont-color").change(function () {
        $(".labelAxis text").css({'stroke': $(this).val() + ''});
    });

    $(".thickness").change(function () {
        $(".labelAxis path").css({'stroke-width': $(this).val() + 'px'});
    });
    $(".axis-color").change(function () {
        $(".labelAxis path").css({'stroke': $(this).val() + ''});
    });
    $('.titlefont-family').change(function () {
        $('.labelAxis').css({'font-family': $(this).val() + ''});
    });

}
;

//Method to change the style of value Axis//

function valueAxisStyle() {
    $(".valuefont_size").change(function () {

        $(".valueAxis text").css({'font-size': $(this).val() + 'px'});
    });
    $(".Font-color").change(function () {
        $(".valueAxis text").css({'stroke': $(this).val() + ''});
    });
    $(".valueaxis-thickness").change(function () {
        $(".valueAxis path").css({'stroke-width': $(this).val() + 'px'});
    });
    $(".valueaxis-color").change(function () {
        $(".valueAxis path").css({'stroke': $(this).val() + ''});
    });
    $('.valueAxistitlefont-family').change(function () {
        $('.valueAxis').css({'font-family': $(this).val() + ''});
    });
}
;
function GridAxisStyle(){
    $(".grid-thickness").change(function(){
        $(".tick line").css({'opacity':$(this).val()+''});
    });
}