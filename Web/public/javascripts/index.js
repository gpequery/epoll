$j(document).ready(function () {
    let electionsIds = $j('input[name="electionsIds"]').val();

    electionsIds.split(',').forEach(id => {
        $j.post('/election/getById', {
            id: id
        }, function (data) {
            let electionHtml = getElectionToHtml(id, data);
            $j('#electionIndexContent').append(electionHtml);

            $j(document).on('click', "#candidateList_"+id, function() {
                $j.post('/election/getCandidateList', {
                    id
                }, function(data) {
                    //TODO
               }, 'json');
            });

            $j(document).on('click', "#addCandidate_"+id, function() {
                $j.post('/election/addOrUpdateCandidate', {
                    id
                }, function(data) {
                    //TODO
                }, 'json');
            });

            $j(document).on('click', "#getCandidate_"+id, function() {
                $j.post('/election/getCandidateById', {
                    id
                }, function(data) {
                    //TODO
                }, 'json');
            });

            $j(document).on('click', "#deleteCandidate_"+id, function() {
                $j.post('/election/deleteCandidateById', {
                    id
                }, function(data) {
                    //TODO
                }, 'json');
            });

            $j(document).on('click', "#vote_"+id, function() {
                $j.post('/election/voteInAnElection', {
                    id
                }, function(data) {
                    //TODO
                }, 'json');
            });

        }, 'json');
    })


});

function getElectionToHtml(electionId, election) {

    let stats = getElectionState(election);

    let html = '';
    html += '<div class="card text-white bg-dark mt-5 col-4 election" election_' + electionId + '">';
    html += '<div class="card-header">' + election.name + '</div>';
    html += '<div class="card-body">' +
        'Début des candidatures :'+ election.candidaturePeriodStart + '</br>' +
        'Fin des candidatures :'+ election.candidaturePeriodEnd + '</br>' +
        'Début des votes :'+ election.votePeriodStart + '</br>' +
        'Fin des votes :'+ election.votePeriodEnd + '</br>' +
        '<button id="candidateList_'+electionId+'" class="btn btn-outline-success my-2 my-sm-0">Liste des candidats</button></br>' +
        '<button id="addCandidate_'+electionId+'" class="btn btn-outline-success my-2 my-sm-0">Ajouter un candidat</button></br>' +
        '<button id="getCandidate_'+electionId+'" class="btn btn-outline-success my-2 my-sm-0">Test recup candidat</button></br>' +
        '<button id="deleteCandidate_'+electionId+'" class="btn btn-outline-success my-2 my-sm-0">Test delete candidat</button></br>' +
        '<button id="vote_'+electionId+'" class="btn btn-outline-success my-2 my-sm-0">Test vote</button></div>';

    html += '<h5 class="card-title">' + stats + '</h5>';
    html += '<p class="card-text">TEXTE ou IMAGE</p>';
    html += '</div>';
    html += '</div>';

    return html;
}
