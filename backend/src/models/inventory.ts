import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
  CreationOptional,
  ForeignKey
} from 'sequelize';
import { Location } from './location';

export type InventoryAttributes = InferAttributes<Inventory>;
export type InventoryCreationAttributes = InferCreationAttributes<Inventory>;

export class Inventory
  extends Model<InventoryAttributes, InventoryCreationAttributes>
  implements InventoryAttributes
{
  public id!: CreationOptional<number>;
  public name!: string;
  public price!: number;
  public locationId!: ForeignKey<Location['id']>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initInventoryModel = (sequelize: Sequelize) => {
  Inventory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
      },
      locationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'locations',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    },
    {
      sequelize,
      tableName: 'inventories',
      modelName: 'Inventory',
      timestamps: true,
      underscored: true
    }
  );
};

