$j(document).ready(function () {
    // $j('body').fireworks();

    let currentDate = new Date().toJSON().split('T')[0];
    $j('#modal-new-election input[type="date"]').prop('min', currentDate);
    $j('#modal-new-election input[type="date"]').val(currentDate);

    $j('#modal-new-election .submit').on('click', function () {
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
        }, function (data) {
            location.reload();
        }, 'json');
    });


    $j('#container').on( "click", ".new-candidat-modal", function() {
        $j('#modal-new-candidat input[name=election_id]').val($j(this).closest('.election').attr('data-id'));
    });

    $j('#modal-new-candidat .submit').on('click', function () {
        let dialog = $j('#modal-new-candidat');

        $j.post('/election/addOrUpdateCandidate', {
            election_id: dialog.find('input[name=election_id]').val(),
            firstname: dialog.find('input[name=firstname]').val(),
            lastname: dialog.find('input[name=lastname]').val(),
            description: dialog.find('input[name=description]').val(),
            image: dialog.find('input[name=image]').val(),
        }, function (data) {
            location.reload();
        }, 'json');
    });

    $j('#modal-new-election input, #modal-new-candidat input').not(':input[type=submit]').on('change, keyup', function () {
        let toShow = true;
        let modal = $j('#' + $j(this).closest('.modal').attr('id'));

        modal.find('input').each(function () {
            if ($j(this).val() === '') {
                toShow = false;
                return false;
            }
        });

        if (toShow) {
            modal.find('input[type=submit]').removeClass('d-none');
        } else {
            modal.find('input[type=submit]').addClass('d-none');
        }
    });

    $j('#modal-new-election input[type="date"]').on('change', function () {
        let maxIndex = $j('#modal-new-election input[type="date"]').length;
        let currentIndex = $j(this).attr('number');

        for (let i = parseInt(currentIndex) + 1; i <= maxIndex; i++) {
            let element = $j('#modal-new-election input[type="date"][number=' + i + ']');

            element.val($j(this).val());
            element.prop('min', $j(this).val());
        }
    })
});
