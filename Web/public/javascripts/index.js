$j(document).ready(function () {
    let electionsIds = $j('input[name="electionsIds"]').val() === '' ? null : $j('input[name="electionsIds"]').val().split(',');

    if (electionsIds) {
        $j('#noElection').hide();

        electionsIds.forEach(id => {
            $j.post('/election/getById', {
                id: id
            }, function (election) {
                $j('#electionIndexContent').append(getElectionToHtml(id, election));
                printCandidatsByElectionId(id);


                // $j(document).on('click', "#candidateList_"+id, function() {
                //     $j.post('/election/getCandidateList', {
                //         id
                //     }, function(data) {
                //         //TODO
                //     }, 'json');
                // });
                //
                // $j(document).on('click', "#getCandidate_"+id, function() {
                //     $j.post('/election/getCandidateById', {
                //         id
                //     }, function(data) {
                //         //TODO
                //     }, 'json');
                // });
                //
                // $j(document).on('click', "#deleteCandidate_"+id, function() {
                //     $j.post('/election/deleteCandidateById', {
                //         id
                //     }, function(data) {
                //         //TODO
                //     }, 'json');
                // });
                //
                // $j(document).on('click', "#vote_"+id, function() {
                //     $j.post('/election/voteInAnElection', {
                //         id
                //     }, function(data) {
                //         //TODO
                //     }, 'json');
                // });
                //
                // $j(document).on('click', "#winner_"+id, function() {
                //     $j.post('/election/getElectionWinner', {
                //         id
                //     }, function(data) {
                //         //TODO
                //     }, 'json');
                // });
                //
                // $j(document).on('click', "#nbVotersByCandidate_"+id, function() {
                //     $j.post('/election/getCandidateNbVotersById', {
                //         id
                //     }, function(data) {
                //         //TODO
                //     }, 'json');
                // });
                //
                // $j(document).on('click', "#deleteElection_"+id, function() {
                //     $j.post('/election/deleteElectionById', {
                //         id
                //     }, function(data) {
                //         //TODO
                //     }, 'json');
                // });

            }, 'json');
        })
    }

    $j('.election .addCandidat').on('click', function (event) {
        console.log('Click');
    });
});

function printCandidatsByElectionId(electionId) {
    $j.post('/election/getCandidateList', {
        election_id: electionId
    }, function (data) {
        console.log(data);
        $j.post('/election/getCandidateById', {
            election_id: electionId,
            candidate_id: data[2][0]
        }, function(candidate) {
            let html = getCandidateToHtmlRow(candidate);
            $j('#table-candidate tbody').append(html);
            console.log(candidate);
        }, 'json');
    }, 'json');

    return null;
}

function getCandidateToHtmlRow(candidate) {
    let html = '';

    html += '<tr>';
    html +=     '<td>' + candidate[2] + '</td>';
    html +=     '<td>' + candidate[3] + '</td>';
    html +=     '<td>' + candidate[4] + '</td>';
    html +=     '<td>' + candidate[5] + '</td>';
    html += '</tr>';

    return html;
}

function getElectionToHtml(electionId, election, candidats = 'Greg') {
    let stats = getElectionState(election);

    let html = '';
    html += '<div class="card text-white bg-dark mt-5 col-5 election" data-id="' + electionId + '">';
    html += '<h2 class="card-header">' + election.name + '</h2>';
    html += '<div class="card-body row justify-content-center">';
    html += '<h5 class="card-title col-12">' + stats + '</h5>';
    html += '<div class="col-5 font-weight-bold">Début des candidatures : </div>';
    html += '<div class="col-3">' + getDateHtmlFromTimeStamp(election.candidaturePeriodStart) + '</div>';

    html += '<div class="col-5 font-weight-bold">Fin des candidatures : </div>';
    html += '<div class="col-3">' + getDateHtmlFromTimeStamp(election.candidaturePeriodEnd) + '</div>';

    html += '<div class="col-5 font-weight-bold">Début des votes : </div>';
    html += '<div class="col-3">' + getDateHtmlFromTimeStamp(election.votePeriodStart) + '</div>';

    html += '<div class="col-5 font-weight-bold">Fin des votes : </div>';
    html += '<div class="col-3">' + getDateHtmlFromTimeStamp(election.votePeriodEnd) + '</div>';

    html += '<div class="card-text col-12 mt-4">';
    html += '<table class="table table-dark table-striped" id="table-candidate"><thead><tr><th>Prénom</th><th>Nom</th><th>Description</th><th>Image</th></tr></thead><tbody></tbody></table>';
    html += '<input class="btn btn-outline-success col-5 new-candidat-modal" data-toggle="modal" data-target="#modal-new-candidat" value="Ajouter candidat" type="submit"/>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    // '<button id="candidateList_'+electionId+'" class="btn btn-outline-success my-2 my-sm-0">Liste des candidats</button></br>' +
    // '<button id="getCandidate_'+electionId+'" class="btn btn-outline-success my-2 my-sm-0">Test recup candidat</button></br>' +
    // '<button id="deleteCandidate_'+electionId+'" class="btn btn-outline-success my-2 my-sm-0">Test delete candidat</button></br>' +
    // '<button id="vote_'+electionId+'" class="btn btn-outline-success my-2 my-sm-0">Test vote</button></br>' +
    // '<button id="winner_'+electionId+'" class="btn btn-outline-success my-2 my-sm-0">Test get winner</button></br>' +
    // '<button id="nbVotersByCandidate_'+electionId+'" class="btn btn-outline-success my-2 my-sm-0">Test nbVotersByCandidate</button>' +
    // '<button id="deleteElection_'+electionId+'" class="btn btn-outline-success my-2 my-sm-0">Test deleteElection</button>';

    return html;
}


