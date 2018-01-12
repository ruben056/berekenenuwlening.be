$(document).ready(function(){

  function renderTable(aflossingen){
      deleteTableContent();
      let $tableBody = $("table tbody ");
      aflossingen.forEach(function(aflossing){
        $tableBody.append(buildRow(aflossing));
      });
  }

  function buildRow(row){
    return $('<tr>')
      .append($('<td>').append(row.maand))
      .append($('<td>').append(row.kapitaal))
      .append($('<td>').append(row.rente))
      .append($('<td>').append(row.totaal))
      .append($('<td>').append(row.resterend));
  }

  function deleteTableContent(){
    $("table tbody ").children().remove();
  };

  function refreshAflossingstabel(){
    var aflossingen = berekenAflossingen();
    renderTable(aflossingen);
  }

  function berekenAflossingen(){
    //1. retrieving forminput
    var ontleendBedrag = $("#ontleendBedrag").val();
    var intrestvoet = $("#intrestvoet").val() / 100;
    var looptijdInMaanden = 12 * $("#looptijd").val();
    var aflossingsMethode = $("#aflossingsmethode").val()

    if(aflossingsMethode == "Vast bedrag per maand"){
      var maandelijkseIntrest = Math.pow(1+intrestvoet, 1/12) - 1;
      var maandelijksBedrag = ontleendBedrag / ((1-Math.pow(1+maandelijkseIntrest,-looptijdInMaanden))/maandelijkseIntrest);
      console.log("maandelijkseIntrest : " + maandelijkseIntrest + ", maandelijksBedrag : " + maandelijksBedrag);

      //2. calculate aflossingen
      var aflossingen = [looptijdInMaanden+1];
      for (var i = 0; i < looptijdInMaanden+1; i++) {

        if(isEersteMaand(i)){
          aflossingen[i] = {maand: i, kapitaal : 0, rente: 0, totaal: 0, resterend: ontleendBedrag};
          continue;
        }

        let openstaandKapitaal = aflossingen[i-1].resterend;
        let rente = openstaandKapitaal * maandelijkseIntrest;
        let kapitaal = maandelijksBedrag - rente;
        let nieuwOpenstaandKapitaal = openstaandKapitaal - kapitaal;

        aflossingen[i] = {maand: i, kapitaal : kapitaal.toFixed(2), rente: rente.toFixed(2),
                            totaal: maandelijksBedrag.toFixed(2), resterend: nieuwOpenstaandKapitaal.toFixed(2)};
      }

      return aflossingen
    }
    else if( aflossingsMethode == "Aflossingsvrij"){
      let rente = (ontleendBedrag * intrestvoet) / 12;
      rente = rente.toFixed(2);
      var aflossingen = [looptijdInMaanden];
      for (var i = 0; i < looptijdInMaanden; i++) {
        aflossingen[i] = {maand: i, kapitaal : 0, rente: rente, totaal: rente, resterend: ontleendBedrag};
      }
      return aflossingen;
    }
    else {
      console.log("aflossings methode : " + aflossingsMethode + " nog niet geimplementeerd");
    }

    return [];

    function isEersteMaand(i){
      return (i == 0);
    }
  }

  $("#btnBerekenAflossing").click(refreshAflossingstabel);
  refreshAflossingstabel();
});
