
$j( document ).ready(function() {
    console.log( "ready!" );

    $j('input').on('click', event => {
    });

    $j('button').on('click', function() {
        $j.get( '/election/list', function() {
        });
    });
});
