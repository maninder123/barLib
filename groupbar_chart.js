/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function () {

    $('.font-color').change(function () {
        console.log($(this).val());
        $('.tick').css({'stroke': $(this).val()});
    });
    $('.titlefont-size').change(function () {
        $('.labelAxis').css({'font-size': $(this).val() + 'px'});
    });
    $('.font-family').change(function () {
        $('.labelAxis').css({'font-family': $(this).val() + ''});
    });
    $('.axis-thickness').change(function () {
        $('.labelAxis path').css({'stroke-width': $(this).val() + ''});
    });
    $('#strokecolor').change(function () {
        $('.labelAxis path').css({'stroke': $(this).val() + ''});
    });



});

