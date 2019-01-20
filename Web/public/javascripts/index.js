$j(document).ready(function () {
    let electionsIds = $j('input[name="electionsIds"]').val() === '' ? null : $j('input[name="electionsIds"]').val().split(',');

    if(electionsIds) {
        $j('#noElection').hide();

        electionsIds.forEach(id => {
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

                $j(document).on('click', "#winner_"+id, function() {
                    $j.post('/election/getElectionWinner', {
                        id
                    }, function(data) {
                        //TODO
                    }, 'json');
                });

                $j(document).on('click', "#nbVotersByCandidate_"+id, function() {
                    $j.post('/election/getCandidateNbVotersById', {
                        id
                    }, function(data) {
                        //TODO
                    }, 'json');
                });

                $j(document).on('click', "#deleteElection_"+id, function() {
                    $j.post('/election/deleteElectionById', {
                        id
                    }, function(data) {
                        //TODO
                    }, 'json');
                });

            }, 'json');
        })
    }
});

function getElectionToHtml(electionId, election) {

    let stats = getElectionState(election);

    let html = '';
    html += '<div class="card text-white bg-dark mt-5 col-4 election" id="election_' + electionId + '">';
    html +=     '<h2 class="card-header">' + election.name + '</h2>';
    html +=     '<div class="card-body row justify-content-center">';
    html +=         '<h5 class="card-title col-12">' + stats + '</h5>';
    html +=         '<div class="col-5 font-weight-bold">Début des candidatures : </div>';
    html +=         '<div class="col-3">' + getDateHtmlFromTimeStamp(election.candidaturePeriodStart) + '</div>';

    html +=         '<div class="col-5 font-weight-bold">Fin des candidatures : </div>';
    html +=         '<div class="col-3">' + getDateHtmlFromTimeStamp(election.candidaturePeriodEnd) + '</div>';

    html +=         '<div class="col-5 font-weight-bold">Début des votes : </div>';
    html +=         '<div class="col-3">' + getDateHtmlFromTimeStamp(election.votePeriodStart) + '</div>';

    html +=         '<div class="col-5 font-weight-bold">Fin des votes : </div>';
    html +=         '<div class="col-3">' + getDateHtmlFromTimeStamp(election.votePeriodEnd) + '</div>';

    html +=         '<p class="card-text col-12">TEXTE ou IMAGE</p>';
    html +=     '</div>';
    html += '</div>';

        // '<button id="candidateList_'+electionId+'" class="btn btn-outline-success my-2 my-sm-0">Liste des candidats</button></br>' +
        // '<button id="addCandidate_'+electionId+'" class="btn btn-outline-success my-2 my-sm-0">Se présenter en tant que candidat</button></br>' +
        // '<button id="getCandidate_'+electionId+'" class="btn btn-outline-success my-2 my-sm-0">Test recup candidat</button></br>' +
        // '<button id="deleteCandidate_'+electionId+'" class="btn btn-outline-success my-2 my-sm-0">Test delete candidat</button></br>' +
        // '<button id="vote_'+electionId+'" class="btn btn-outline-success my-2 my-sm-0">Test vote</button></br>' +
        // '<button id="winner_'+electionId+'" class="btn btn-outline-success my-2 my-sm-0">Test get winner</button></br>' +
        // '<button id="nbVotersByCandidate_'+electionId+'" class="btn btn-outline-success my-2 my-sm-0">Test nbVotersByCandidate</button>' +
        // '<button id="deleteElection_'+electionId+'" class="btn btn-outline-success my-2 my-sm-0">Test deleteElection</button>';

    return html;
}
