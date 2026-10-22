// Map Engine & Balanced First-Past-The-Post Seat Allocation (Version 0.2)
import { gameState } from "../core/state.js";

export const mapEngine = {
  // First-Past-The-Post (FPTP) Seat Projection Algorithm
  recalculateAllProjections() {
    const player = gameState.getPlayer();
    let totalPlayerSeats = 0;
    let totalNdaSeats = 0;
    let totalIndiaSeats = 0;
    let totalThirdSeats = 0;

    const isAlliedWithIndia = player.coalition === "INDIA" || (gameState.getParty("UPC") && gameState.getParty("UPC").trustScore >= 75);
    const isAlliedWithNda = player.coalition === "NDA" || (gameState.getParty("BVP") && gameState.getParty("BVP").trustScore >= 75);

    gameState.states.forEach(state => {
      let statePlayerWins = 0;
      let stateNdaWins = 0;
      let stateIndiaWins = 0;
      let stateOthersWins = 0;

      let sumPlayerVote = 0;
      let sumNdaVote = 0;
      let sumIndiaVote = 0;
      let sumOthersVote = 0;

      const activeStateRallies = state.activeRallies || [];

      state.districts.forEach(district => {
        // Retrieve persistent vote shares
        const vs = district.voteShares || { PLAYER: 15, NDA: 44, INDIA: 35, OTHERS: 6 };

        // Calculate dynamic momentum adjustments
        let effPlayer = vs.PLAYER;
        let effNda = vs.NDA;
        let effIndia = vs.INDIA;
        let effOthers = vs.OTHERS;

        // Active Rally Boost
        activeStateRallies.forEach(rally => {
          const isDirect = rally.districtId === district.id;
          const boost = isDirect ? 4.5 : 1.5;

          if (rally.partyId === player.id) {
            effPlayer += boost;
            effNda -= (boost * 0.55);
            effIndia -= (boost * 0.45);
          } else if (rally.partyId === "BVP") {
            effNda += boost;
            effPlayer -= (boost * 0.5);
            effIndia -= (boost * 0.5);
          } else if (rally.partyId === "UPC") {
            effIndia += boost;
            effPlayer -= (boost * 0.5);
            effNda -= (boost * 0.5);
          }
        });

        // National approval slight modifier
        const approvalDelta = (player.nationalApproval - 34) * 0.2;
        effPlayer += approvalDelta;
        effNda -= (approvalDelta * 0.5);
        effIndia -= (approvalDelta * 0.5);

        // Normalize
        const totalRaw = Math.max(1, effPlayer + effNda + effIndia + effOthers);
        const normPlayer = Math.max(1, Math.round((effPlayer / totalRaw) * 1000) / 10);
        const normNda = Math.max(2, Math.round((effNda / totalRaw) * 1000) / 10);
        const normIndia = Math.max(2, Math.round((effIndia / totalRaw) * 1000) / 10);
        const normOthers = Math.max(1, Math.round((100 - (normPlayer + normNda + normIndia)) * 10) / 10);

        sumPlayerVote += normPlayer;
        sumNdaVote += normNda;
        sumIndiaVote += normIndia;
        sumOthersVote += normOthers;

        // Determine district winner
        let winner = "NDA";
        if (isAlliedWithIndia) {
          // Combined coalition candidate
          if (normPlayer > normIndia && normPlayer > normNda && normPlayer > normOthers) {
            winner = "PLAYER";
          } else if (normIndia >= normNda && normIndia >= normOthers) {
            winner = "INDIA";
          } else if (normOthers > normNda) {
            winner = "OTHERS";
          } else {
            winner = "NDA";
          }
        } else if (isAlliedWithNda) {
          if (normPlayer > normNda && normPlayer > normIndia && normPlayer > normOthers) {
            winner = "PLAYER";
          } else if (normNda >= normIndia && normNda >= normOthers) {
            winner = "NDA";
          } else if (normIndia > normOthers) {
            winner = "INDIA";
          } else {
            winner = "OTHERS";
          }
        } else {
          // Independent battle
          const maxVal = Math.max(normPlayer, normNda, normIndia, normOthers);
          if (maxVal === normPlayer) winner = "PLAYER";
          else if (maxVal === normIndia) winner = "INDIA";
          else if (maxVal === normNda) winner = "NDA";
          else winner = "OTHERS";
        }

        district.projectedWinner = winner;

        if (winner === "PLAYER") statePlayerWins++;
        else if (winner === "NDA") stateNdaWins++;
        else if (winner === "INDIA") stateIndiaWins++;
        else stateOthersWins++;
      });

      const distCount = state.districts.length || 1;
      const avgPlayerShare = sumPlayerVote / (distCount * 100);
      const avgNdaShare = sumNdaVote / (distCount * 100);
      const avgIndiaShare = sumIndiaVote / (distCount * 100);
      const avgOthersShare = sumOthersVote / (distCount * 100);

      // Realistic Seat Allocation: Blend 60% district FPTP victories + 40% proportional vote share
      let pSeats = 0;
      let nSeats = 0;
      let iSeats = 0;
      let oSeats = 0;

      if (state.totalSeats === 1) {
        // Single seat winner-takes-all
        const win = state.districts[0].projectedWinner;
        if (win === "PLAYER") pSeats = 1;
        else if (win === "INDIA") iSeats = 1;
        else if (win === "NDA") nSeats = 1;
        else oSeats = 1;
      } else {
        const rawP = (0.6 * (statePlayerWins / distCount) + 0.4 * avgPlayerShare) * state.totalSeats;
        const rawN = (0.6 * (stateNdaWins / distCount) + 0.4 * avgNdaShare) * state.totalSeats;
        const rawI = (0.6 * (stateIndiaWins / distCount) + 0.4 * avgIndiaShare) * state.totalSeats;
        const rawO = (0.6 * (stateOthersWins / distCount) + 0.4 * avgOthersShare) * state.totalSeats;

        pSeats = Math.round(rawP);
        nSeats = Math.round(rawN);
        iSeats = Math.round(rawI);
        oSeats = Math.max(0, state.totalSeats - (pSeats + nSeats + iSeats));

        // Make sure sum equals totalSeats
        const seatDiff = state.totalSeats - (pSeats + nSeats + iSeats + oSeats);
        if (seatDiff !== 0) {
          if (rawN >= rawI) nSeats += seatDiff;
          else iSeats += seatDiff;
        }
      }

      state.projectedPartySeats = {
        PLAYER: pSeats,
        NDA: nSeats,
        INDIA: iSeats,
        OTHERS: oSeats
      };

      // State lead party color identification
      const maxSeats = Math.max(pSeats, nSeats, iSeats, oSeats);
      if (maxSeats === pSeats && pSeats > 0) {
        state.projectedLeadParty = "PLAYER";
      } else if (maxSeats === iSeats) {
        state.projectedLeadParty = "INDIA";
      } else if (maxSeats === nSeats) {
        state.projectedLeadParty = "NDA";
      } else {
        state.projectedLeadParty = "OTHERS";
      }

      totalPlayerSeats += pSeats;
      totalNdaSeats += nSeats;
      totalIndiaSeats += iSeats;
      totalThirdSeats += oSeats;
    });

    // Ensure total across India is exactly 543
    const globalTotal = totalPlayerSeats + totalNdaSeats + totalIndiaSeats + totalThirdSeats;
    const diff = 543 - globalTotal;
    if (diff !== 0) {
      if (totalNdaSeats >= totalIndiaSeats) totalNdaSeats += diff;
      else totalIndiaSeats += diff;
    }

    gameState.nationalSeatTally = {
      PLAYER: totalPlayerSeats,
      NDA: totalNdaSeats,
      INDIA: totalIndiaSeats,
      THIRD_FRONT: totalThirdSeats
    };

    return gameState.nationalSeatTally;
  },

  // State fill color on SVG map
  getStateFillColor(state) {
    const player = gameState.getPlayer();
    switch (state.projectedLeadParty) {
      case "PLAYER":
        return player.color || "#ff9933";
      case "NDA":
        return "#ea580c"; // NDA Saffron-Orange
      case "INDIA":
        return "#2563eb"; // INDIA Royal Blue
      default:
        // Regional Stronghold Colors
        if (state.id === "WB") return "#10b981"; // Trinamool green
        if (state.id === "TN") return "#dc2626"; // DMK crimson
        if (state.id === "PB" || state.id === "DL") return "#eab308"; // AAP yellow
        if (state.id === "AP") return "#0284c7"; // YSRCP blue
        if (state.id === "OD") return "#059669"; // BJD emerald
        return "#475569"; // Slate gray
    }
  }
};
