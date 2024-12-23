import React, { useEffect, useState } from "react";
import css from "./layout.module.scss";
import Header from "../header/Header";
import axios from "axios";
import { URL_POKEMON } from "../../../api/apiRest";
import Card from "../card/Card";
import * as FaIcons from "react-icons/fa";

export default function LayoutHome() {
  const [arrayPokemon, setArrayPokemon] = useState([]);
  const [arrayAllPokemon, setAllArrayPokemon] = useState([]);
  const [xpage, setXpage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const api = async () => {
      const limit = 15;
      const xp = (xpage - 1) * limit;

      const apiPoke = await axios.get(
        `${URL_POKEMON}/?offset=&${xp}&limit=${limit}`
      );

      setArrayPokemon(apiPoke.data.results);
    };
    api();
    getAllPokemon();
  }, [xpage]);

  const getAllPokemon = async () => {
    const res = await axios.get(`${URL_POKEMON}?offset=0&limit=1000`);
    const promises = res?.data?.results?.map((pokemon) => pokemon);
    const results = await Promise.all(promises);
    setAllArrayPokemon(results);
  };

  const filterPokemons =
    search?.length > 0
      ? arrayAllPokemon?.filter((pokemon) => pokemon?.name?.includes(search))
      : arrayPokemon;

  const obtenerSearch = (e) => {
    const texto = e.toLowerCase();
    setSearch(texto);
    setXpage(1);
  };

  console.log(search);

  return (
    <div className={css.layout}>
      <Header obtenerSearch={obtenerSearch} />
      {/* Sección de paginación */}
      <section className={css.section_pagination}>
        <div className={css.div_pagination}>
          {/* Botón para retroceder */}
          <span
            className={css.item_izquierdo}
            onClick={() => {
              if (xpage === 1) {
                console.log("No puedo retroceder");
                return;
              }
              setXpage(xpage - 1);
            }}
          >
            <FaIcons.FaAngleLeft />
          </span>

          {/* Página actual */}
          <span className={css.item}>{xpage}</span>

          {/* Texto "DE" */}
          <span className={css.item}>DE</span>

          {/* Total de páginas */}
          <span className={css.item}>
            {Math.round(arrayAllPokemon?.length / 15)}
          </span>

          {/* Botón para avanzar */}
          <span
            className={css.item_derecho}
            onClick={() => {
              if (xpage === 67) {
                console.log("Es el último");
                return;
              }
              setXpage(xpage + 1);
            }}
          >
            <FaIcons.FaAngleRight />
          </span>
        </div>
      </section>

      {/* Contenedor de las tarjetas */}
      <div className={css.card_content}>
        {filterPokemons?.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>
    </div>
  );
}
