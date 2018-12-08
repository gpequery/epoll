$j( document ).ready(function() {
    console.log( "ready!" );

    $j('input').on('click', event => {
        console.log('CLick !');
    });
});
