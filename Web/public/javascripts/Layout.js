$j(document).ready(function() {
    let currentDate = new Date().toJSON().split('T')[0];
    $j('#modal-new-election input[type="date"]').prop('min', currentDate);
    $j('#modal-new-election input[type="date"]').val(currentDate);

    $j('#modal-new-election .submit').on('click', function() {
        let dialog = $j('#modal-new-election');
        let election_name = dialog.find('input[name=election_name]').val();
        let election_start_candidate = dialog.find('input[name=election_start_candidate]').val();
        let election_end_candidate = dialog.find('input[name=election_end_candidate]').val();
        let election_start_vote = dialog.find('input[name=election_start_vote]').val();
        let election_end_vote = dialog.find('input[name=election_end_vote]').val();

        $j.post('/election/create', {
            election_name: election_name,
            election_start_candidate: election_start_candidate,
            election_end_candidate: election_end_candidate,
            election_start_vote: election_start_vote,
            election_end_vote: election_end_vote
        }, function(data) {
            $j('#modal-new-election').modal('hide');
        }, 'json');
    });

    $j('#modal-new-election input').not(':input[type=submit]').on('change, keyup', function() {
        let toShow = true;
        $j('#modal-new-election input').each(function() {
            if($j(this).val() === '') {
                toShow = false;
                return false;
            }
        });

        if(toShow) {
            $j('#modal-new-election input[type=submit]').removeClass('d-none');
        } else {
            $j('#modal-new-election input[type=submit]').addClass('d-none');
        }
    });



    $j('#modal-new-election input[type="date"]').on('change', function() {
        let maxIndex = $j('#modal-new-election input[type="date"]').length;
        let currentIndex = $j(this).attr('number');

        for(let i = parseInt(currentIndex) + 1; i <= maxIndex; i ++) {
            let element = $j('#modal-new-election input[type="date"][number=' + i + ']');

            element.val($j(this).val());
            element.prop('min', $j(this).val());
        }
    })
});
