import styled from "styled-components";

export const Card = styled.div`
  background: white;
  padding: 15px;
  border-radius: 12px;
`;

export const ImageWrapper = styled.div`
  width: 100%;
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const Title = styled.h3`
  margin: 10px 0;
`;

export const Price = styled.p`
  color: #ff5722;
  font-weight: bold;
`;

export const AddButton = styled.button`
  width: 100%;
  margin-top: 12px;
  padding: 0.85rem 1rem;
  background: #ff7f50;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: #ff6347;
    transform: translateY(-1px);
  }
`;
