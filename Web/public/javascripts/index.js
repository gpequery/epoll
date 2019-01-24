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

    $j('body').on('click', '.election.periodVote tr', function (event) {
        if(confirm('Voter ?')) {
            $j.post('/election/voteInAnElection', {
                election_id: $j(this).closest('.election').attr('data-id'),
                candidate_id: $j(this).attr('data-candidate-id')
            }, function() {
                alert('A voter !');
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
                    let winnerModal = $j('#modal-winner');

                    winnerModal.find('.modal-body .image').attr('src', candidate.pictureUrl);
                    winnerModal.find('.modal-body .fullName').html(candidate.firstName + ' ' + candidate.lastName);
                    winnerModal.find('.modal-body .description').html(candidate.description);

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
        if (data['addresses'].length) {
            $j.post('/election/getCandidateById', {
                election_id: electionId,
                candidate_id: data[2][0]
            }, function(candidate) {
                if (candidate[0]) {
                    let candidateHtml = getCandidateToHtmlRow(candidate, electionId, data[2][0]);
                    $j('.election[data-id="' + electionId + '"] .table-candidate tbody').append(candidateHtml);
                    $j('.election[data-id="' + electionId + '"] .table-candidate').show();
                }
            }, 'json');
        } else {
            $j('.election[data-id="' + electionId + '"] .table-candidate').hide();
        }
    }, 'json');

    return null;
}

function getCandidateToHtmlRow(candidate, election_id, candidate_id) {
    let html = '';

    html += '<tr class="cursor-pointer" data-candidate-id="' + candidate_id + '">';
    html +=     '<td><img src="' + candidate.pictureUrl + '" style="max-height: 60px"/></td>';
    html +=     '<td>' + candidate.firstName + '</td>';
    html +=     '<td>' + candidate.lastName + '</td>';
    html +=     '<td>' + candidate.description + '</td>';
    html +=     '<td class="removeCandidate text-danger">x</td>';
    html += '</tr>';

    return html;
}

function getElectionToHtml(electionId, election) {
    let stats_data = getElectionState(election);

    let className;

    switch (stats_data.status) {
        case 1:
            className = 'periodCandidate';
            break;
        case 3:
            className = 'periodVote';
            break;
        default:
            className = 'default';
    }

    let html = '';
    html += '<div class="card text-white bg-dark mt-5 col-5 election ' + className + '" data-id="' + electionId + '">';
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
    html += '<table class="table table-dark table-striped table-candidate">';
    html += '<thead><tr><th></th><th>Prénom</th><th>Nom</th><th>Description</th><th></th></th></tr></thead><tbody></tbody>';
    html += '</table>';
    html += '<div class="row justify-content-around">';

    if(stats_data.status === 1) {
        html += '<input class="btn btn-outline-success col-5 new-candidat-modal" data-toggle="modal" data-target="#modal-new-candidat" value="Ajouter candidat" type="submit"/>';
    }

    if(stats_data.status === 4) {
        html += '<input class="btn btn-outline-success col-5 offset-1 see-result cursor-pointer" value="Resultat" type="submit"/>';
    }

    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    return html;
}


