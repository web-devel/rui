import * as React from "react";
import {useQuery, gql} from '@apollo/client';
import {Car} from "../../cuba/entities/scr$Car";
import {Card} from "antd";


export const CarBrowseGql: React.FC = () => {

  const {loading, error, data: cars} = useQuery<Car[]>(gql`
    query {
      cars {
        id,
        manufacturer,
        model,
        garage {
          id,
          name
        }
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h3>Cars</h3>
      {cars?.map(car =>
        <Card>
          {car.manufacturer} - {car.model}
        </Card>
      )}
    </div>
  )
}