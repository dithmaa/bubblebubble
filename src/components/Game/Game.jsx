import React, { useCallback, useEffect, useState } from "react";

import popitImg from "../../assets/img/popi.png";
import marketIcon from "../../assets/img/market_icon.png";
import boostImg1 from "../../assets/img/icon-boost-1.png";
import boostImg2 from "../../assets/img/icon-boost-2.png";
import marketBig from "../../assets/img/market_icon_big.png";
import preloaderImg from "../../assets/img/loading.gif";
import axios from "axios";
import debounce from "lodash.debounce";
import Signup from "../../pages/Signup/Signup";
import Signin from "../../pages/Signin/Signin";

function Game({ authId }) {
  const [bubbleStates, setBubbleStates] = useState(
    Array.from({ length: 6 }, () => Array(6).fill(false))
  );
  //   console.log(authId);
  const [currentScore, setScore] = useState(0);
  const [isLoadedApp, setLoaded] = useState(false);
  const [isShowMarket, setShownMarket] = useState(false);
  const [shownScore, setShown] = useState(0);
  const [clickPerOne, setClickPerOne] = useState(1);
  const [isShowMenu, setShowMenu] = useState(1);
  const [isShowBoostPage, setShowBoostPage] = useState(0);
  const [isNowBoosting, setIsNowBoosting] = useState(0);
  const [boostsLists, setBoostsLists] = useState([]);
  const [currentOpenedBoost, setCurrentOpenedBoost] = useState(0);
  const handleBubbleClick = (rowIndex, colIndex) => {
    const newBubbleStates = [...bubbleStates];
    newBubbleStates[rowIndex][colIndex] = !newBubbleStates[rowIndex][colIndex];
    setBubbleStates(newBubbleStates);

    setScore((prevScore) => {
      prevScore = Number(clickPerOne) + Number(prevScore);
      testDebounce(prevScore);
      setShown(prevScore);
      // console.log("score", prevScore);
      return prevScore;
    });
    // console.log(currentScore);
  };

  const testDebounce = useCallback(
    debounce((num) => {
      axios.put(
        `https://65eafaa243ce16418932f611.mockapi.io/popit/popit/${authId}`,
        {
          clickAmount: num,
        }
      );
    }, 1400),
    []
  );
  const debounceBoosting = useCallback(
    debounce((newBoostVal, newBoostLists, newScore) => {
      console.log(newBoostLists);
      axios.put(
        `https://65eafaa243ce16418932f611.mockapi.io/popit/popit/${authId}`,
        {
          clickPerOne: newBoostVal,
          clickAmount: newScore,
          boosts: newBoostLists,
        }
      );
    }, 200),
    []
  );
  const handleShowMarket = () => {
    setShownMarket(true);
    setShowMenu(false);
  };
  const handleBackMarket = () => {
    setShownMarket(false);
    setShowMenu(true);
  };
  const handleBackBoost = () => {
    setShowBoostPage(false);
  };
  const handleShowBoostPage = (currentPage) => {
    setShowBoostPage(true);
    setCurrentOpenedBoost(currentPage);
    // setShownMarket(false);
  };
  // console.log("clickPerOne ", clickPerOne);
  const handleBoosting = () => {
    const boostELem = boostsLists[currentOpenedBoost];
    const pricePercent = boostELem.price * 0.1;

    const newBoostPrice = Math.floor(pricePercent + boostELem.price);
    console.log(pricePercent);
    const newBoostLevel = 1 + boostELem.level;
    const newScore = currentScore - boostELem.price;

    const newBoostLists = boostsLists.filter((boost) => {
      if (boost.id != boostELem.id) {
        // Удаляю из массива буст который прокачали, чтобы снова запушить
        return true;
      }
    });
    newBoostLists.push(boostELem);
    newBoostLists.sort((a, b) => a.id - b.id);
    console.log("newBoostLists ", newBoostLists);
    boostELem.price = newBoostPrice;
    boostELem.level = newBoostLevel;
    // console.log(newBoostItemлщ);
    setScore(newScore);
    setShown(newScore);
    let newBoostVal = boostsLists[currentOpenedBoost].power + clickPerOne;
    debounceBoosting(newBoostVal, newBoostLists, newScore);
    setIsNowBoosting(true);
    setClickPerOne(newBoostVal);
    setTimeout(() => {
      setIsNowBoosting(false);
    }, 900);
  };

  useEffect(() => {
    axios
      .get(
        `https://65eafaa243ce16418932f611.mockapi.io/popit/popit?id=${authId}`
      )
      .then(({ data }) => {
        setScore(data[0].clickAmount);
        setClickPerOne(data[0].clickPerOne);
        setBoostsLists(data[0].boosts);
        setTimeout(() => {
          setLoaded(true);
        }, 900);
      })
      .catch((err) => {
        localStorage.removeItem("isAuth");
        localStorage.removeItem("authId");

        window.location.reload();
      });
  }, []);

  function toShort(number) {
    const powers = ["", "", "M", "B", "T", "KV"];

    let shortened = "";
    let divider = 1;

    number = parseInt(number, 10).toString(); // Convert number to string to remove leading zeros
    for (let i = powers.length - 1; i >= 0; i--) {
      divider = Math.pow(1000, i);
      if (parseInt(number) >= divider) {
        let number_with_digits = (parseInt(number) / divider).toFixed(3); // Round the number to 3 decimal places
        number_with_digits = number_with_digits.replace(
          /(\.\d*?[1-9])0+$/,
          "$1"
        ); // Keep trailing zeros for non-zero digit after decimal
        shortened = number_with_digits + "" + powers[i];
        break;
      }
    }

    return shortened;
  }
  const animateScore = (sco) => {
    let smallNum;
    // let shortNum = "";

    if (sco < 1000) {
      // console.log("small");
      smallNum = sco * 0.9;
    } else if (sco >= 1000 && sco < 10000) {
      // console.log("more");
      smallNum = sco * 0.99;
    } else if (sco >= 10000 && sco < 100000) {
      smallNum = sco * 0.999;
    } else if (sco >= 100000 && sco < 1000000) {
      smallNum = sco * 0.9999;
    } else {
    }

    const interval = setInterval(() => {
      if (smallNum < sco) {
        ++smallNum;
        setShown(smallNum.toFixed(0)); // из-за округления показывает на 1 больше чем в бд
        // console.log(smallNum);

        // setNumber((prevNumber) => prevNumber + 1);
      } else {
        clearInterval(interval);
        setShown(sco);
      }
    }, 10);

    return () => clearInterval(interval);
  };
  useEffect(() => animateScore(currentScore), [isLoadedApp]);
  return (
    <>
      {isShowMarket ? (
        <div className="market">
          {isShowBoostPage ? (
            <div className="boost-page">
              <div className="container" style={{ alignItems: "start" }}>
                <button className="back" onClick={handleBackBoost}>
                  Назад
                </button>
              </div>

              <div className="container">
                <img
                  src={boostsLists[currentOpenedBoost].image}
                  className="boost-picture"
                />
                <h3 className="h3">{boostsLists[currentOpenedBoost].title}</h3>
                <span className="boost-info">
                  +{boostsLists[currentOpenedBoost].power} за клик при
                  увеличении уровня
                </span>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p>
                    <span
                      className="option-price price"
                      style={{
                        color:
                          currentScore < boostsLists[currentOpenedBoost].price
                            ? "rgb(199 62 62)"
                            : "#5ecf52",
                      }}
                    >
                      {boostsLists[currentOpenedBoost].price}
                    </span>
                  </p>

                  <span className="option-level">
                    <span>{boostsLists[currentOpenedBoost].level}</span> уровень
                  </span>
                </div>
                <div className="boost-page__bottom">
                  <div
                    className="current-score-place"
                    style={{ width: "100%" }}
                  >
                    <span>Твой баланс:</span>
                    <p>
                      <img
                        className="buba-score-icon"
                        src={boostImg1}
                        alt="Buba Icon"
                      />
                      {shownScore}
                    </p>
                  </div>
                  <div
                    className="boost-btn-div"
                    style={{ textAlign: "center" }}
                  >
                    {isNowBoosting ? (
                      <button disabled={true} className="boost-btn">
                        Прокачать уровень
                      </button>
                    ) : currentScore < boostsLists[currentOpenedBoost].price ? (
                      <button
                        className="boost-btn"
                        style={{
                          backgroundColor: "#7d0000",
                          color: "#fff",
                          opacity: "0.5",
                        }}
                      >
                        Не достаточный баланс
                      </button>
                    ) : (
                      <button className="boost-btn" onClick={handleBoosting}>
                        Прокачать уровень
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="container" style={{ alignItems: "start" }}>
            <button className="back" onClick={handleBackMarket}>
              Назад
            </button>
          </div>
          <div className="container">
            <div className="market-offer">
              <img src={marketBig} />
              <h2>Бусты</h2>
            </div>
            <div className="current-score-place">
              <span>Твой баланс:</span>
              <p>
                <img
                  className="buba-score-icon"
                  src={boostImg1}
                  alt="Buba Icon"
                />
                {shownScore}
              </p>
            </div>
            <div className="market-options">
              <h4 className="market-options__title">Мощность клика</h4>
              <div className="market-options__wrapper">
                {boostsLists
                  ? boostsLists.map((boost, index) => {
                      return (
                        <div
                          className="option"
                          key={index + "d8dew"}
                          onClick={() => handleShowBoostPage(index)}
                        >
                          <div className="option-img">
                            <img src={boost.image} alt="option-img" />
                          </div>
                          <div className="option-info">
                            <h5>{boost.title}</h5>
                            <div className="option-info__params">
                              <span
                                className="option-price"
                                style={{
                                  color:
                                    currentScore < boost.price
                                      ? "rgb(199 62 62)"
                                      : "#5ecf52",
                                }}
                              >
                                {boost.price}
                              </span>
                              <span className="option-level">
                                <span>{boost.level}</span> ур.
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : ""}
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {isLoadedApp ? (
        <div className="container">
          <div className="res">
            <img className="buba-score-icon" src={boostImg1} alt="Buba Icon" />
            {shownScore < 1000000 ? shownScore : toShort(shownScore)}
          </div>
          <div
            className="popit"
            style={{ backgroundImage: `url(${popitImg})` }}
          >
            <div className="grid">
              {bubbleStates.map((row, rowIndex) => (
                <div key={rowIndex} className="popit-row">
                  {row.map((active, colIndex) => (
                    <div
                      key={colIndex}
                      className={`cell ${active ? "active" : ""}`}
                      onClick={() => handleBubbleClick(rowIndex, colIndex)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          {isShowMenu ? (
            <nav className="menu">
              <button className="menu__item" onClick={handleShowMarket}>
                <img src={marketIcon} alt="Market Icon" />
                <span>Бусты</span>
              </button>
            </nav>
          ) : (
            ""
          )}
        </div>
      ) : (
        <div className="preloader">
          <img className="preloader-icon" src={popitImg} />
          <h2>Загружаем ваши пузырики ...</h2>
          <img className="preloader-loading" src={preloaderImg} />
        </div>
      )}
    </>
  );
}

export default Game;
