$j(document).ready(function() {
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
            console.log('data');
            console.log(data);
        }, 'json');
    });

    $j('#listCandidate .submit').on('click', function() {
        $j.post('/election/getCandidateList', {
        }, function(data) {
            console.log('data');
            console.log(data);
        }, 'json');
    });
});
