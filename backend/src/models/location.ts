import {
  DataTypes,
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from 'sequelize';

export type LocationAttributes = InferAttributes<Location>;
export type LocationCreationAttributes = InferCreationAttributes<Location>;

export class Location
  extends Model<LocationAttributes, LocationCreationAttributes>
  implements LocationAttributes
{
  public id!: CreationOptional<number>;
  public name!: string;
}

export const initLocationModel = (sequelize: Sequelize) => {
  Location.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true
      }
    },
    {
      sequelize,
      tableName: 'locations',
      modelName: 'Location',
      timestamps: true,
      underscored: true
    }
  );
};

