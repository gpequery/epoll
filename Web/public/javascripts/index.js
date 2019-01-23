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

                // $j(document).on('click', "#vote_"+id, function() {
                //     $j.post('/election/voteInAnElection', {
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

    $j('body').on('click', '.removeCandidate', function (event) {
        if(confirm('Supprimer le candidat ?')) {
            $j.post('/election/deleteCandidateById', {
                election_id: $j(this).closest('.election').attr('data-id')
            }, function() {
                location.reload();
            }, 'json');
        }
    });

    $j('body').on('click', '.deleteElection', function (event) {
        if(confirm('Supprimer l\'election ?')) {
            $j.post('/election/deleteElectionById', {
                election_id: $j(this).closest('.election').attr('data-id')
            }, function() {
                location.reload();
            }, 'json');
        }
    });

    $j('body').on('click', '.election tr', function (event) {
        if(confirm('Voter ?')) {
            $j.post('/election/voteInAnElection', {
                election_id: $j(this).closest('.election').attr('data-id'),
                candidate_id: $j(this).attr('data-candidate-id')
            }, function() {
                location.reload();
            }, 'json');
        }
    });

    $j('body').on('click', '.election .see-result', function (event) {
        let election_id = $j(this).closest('.election').attr('data-id');
        $j.post('/election/getElectionWinner', {
            election_id: election_id,
        }, function(candidatId) {
            $j.post('/election/getCandidateById', {
                election_id: election_id,
                candidate_id: candidatId
            }, function(candidate) {
                if(candidate) {
                    console.log(candidate);
                    let winnerModal = $j('#modal-winner');

                    winnerModal.find('.modal-body .image').attr('src', candidate[5]);
                    winnerModal.find('.modal-body .fullName').html(candidate[2] + ' ' + candidate[3]);
                    winnerModal.find('.modal-body .description').html(candidate[4]);

                    winnerModal.modal('show');

                    $j('body').fireworks();
                } else {
                    alert('Pas de Winner !');
                }
            });
        });
    });

    $j("#modal-winner").on('hidden.bs.modal', function () {
        $j('body').fireworks('destroy');
    })
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
            if (candidate[0]) {
                let candidateHtml = getCandidateToHtmlRow(candidate, electionId, data[2][0]);
                $j('.election[data-id="' + electionId + '"] #table-candidate tbody').append(candidateHtml);
            }
        }, 'json');
    }, 'json');

    return null;
}

function getCandidateToHtmlRow(candidate, election_id, candidate_id) {
    let html = '';

    html += '<tr class="cursor-pointer" data-candidate-id="' + candidate_id + '">';
    html +=     '<td><img src="' + candidate[5] + '" style="max-height: 60px"/></td>';
    html +=     '<td>' + candidate[2] + '</td>';
    html +=     '<td>' + candidate[3] + '</td>';
    html +=     '<td>' + candidate[4] + '</td>';
    html +=     '<td class="removeCandidate text-danger">x</td>';
    html += '</tr>';

    return html;
}

function getElectionToHtml(electionId, election) {
    let stats_data = getElectionState(election);

    let html = '';
    html += '<div class="card text-white bg-dark mt-5 col-5 election" data-id="' + electionId + '">';
    html += '<h2 class="card-header row"><span class="col-11">' + election.name + '</span><span class="col-1 cursor-pointer text-danger deleteElection">X</span></h2>';
    html += '<div class="card-body row justify-content-center">';
    html += '<h5 class="card-title col-12">' + stats_data.trad + '</h5>';
    html += '<div class="col-5 font-weight-bold">Début des candidatures : </div>';
    html += '<div class="col-3">' + getDateHtmlFromTimeStamp(election.candidaturePeriodStart) + '</div>';

    html += '<div class="col-5 font-weight-bold">Fin des candidatures : </div>';
    html += '<div class="col-3">' + getDateHtmlFromTimeStamp(election.candidaturePeriodEnd) + '</div>';

    html += '<div class="col-5 font-weight-bold">Début des votes : </div>';
    html += '<div class="col-3">' + getDateHtmlFromTimeStamp(election.votePeriodStart) + '</div>';

    html += '<div class="col-5 font-weight-bold">Fin des votes : </div>';
    html += '<div class="col-3">' + getDateHtmlFromTimeStamp(election.votePeriodEnd) + '</div>';

    html += '<div class="card-text col-12 mt-4">';
    html += '<table class="table table-dark table-striped" id="table-candidate">';
    html += '<thead><tr><th></th><th>Prénom</th><th>Nom</th><th>Description</th><th></th></th></tr></thead><tbody></tbody>';
    html += '</table>';
    html += '<div class="row justify-content-around">';

    if(stats_data.status === 1) {
        html += '<input class="btn btn-outline-success col-5 new-candidat-modal" data-toggle="modal" data-target="#modal-new-candidat" value="Ajouter candidat" type="submit"/>';
    }

    html += '<input class="btn btn-outline-success col-5 offset-1 see-result cursor-pointer" value="Resultat" type="submit"/>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    // '<button id="vote_'+electionId+'" class="btn btn-outline-success my-2 my-sm-0">Test vote</button></br>' +
    // '<button id="winner_'+electionId+'" class="btn btn-outline-success my-2 my-sm-0">Test get winner</button></br>' +
    // '<button id="nbVotersByCandidate_'+electionId+'" class="btn btn-outline-success my-2 my-sm-0">Test nbVotersByCandidate</button>' +
    // '<button id="deleteElection_'+electionId+'" class="btn btn-outline-success my-2 my-sm-0">Test deleteElection</button>';

    return html;
}


