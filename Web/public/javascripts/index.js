$j(document).ready(function () {
    let electionsIds = $j('input[name="electionsIds"]').val();

    electionsIds.split(',').forEach(id => {
        $j.post('/election/getById', {
            id: id
        }, function (data) {
            var electionHtml = getElectionToHtml(id, data);
            $j('#electionIndexContent').append(electionHtml);
        }, 'json');
    })
});

function getElectionToHtml(id, election) {
    console.log(election);
    let stats = getElectionState(election);

    let html = '';
    html += '<div class="card text-white bg-dark mt-5 col-4 election" election_' + id + '">';
    html += '<div class="card-header">' + election.name + '</div>';
    html += '<div class="card-body">';
    html += '<h5 class="card-title">' + stats + '</h5>';
    html += '<p class="card-text">TEXTE ou IMAGE</p>';
    html += '</div>';
    html += '</div>';

    return html;
}
