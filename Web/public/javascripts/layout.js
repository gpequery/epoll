$j(document).ready(function() {
    $j('#modal-new-election .submit').on('click', function() {
        var dialog = $j('#modal-new-election');
        var label = dialog.find('input[name=label]').val();

        console.log('New election : ' + label);

        $j.post('/election/create', {
            label: label
        }, function(data) {
            console.log('data');
            console.log(data);
        }, 'json');
    });
});
