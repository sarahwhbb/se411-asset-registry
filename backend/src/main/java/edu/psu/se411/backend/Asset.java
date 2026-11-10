package edu.psu.se411.backend;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PastOrPresent;

@Entity
public class Asset {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "Asset tag is required")
	private String assetTag;
	@NotBlank(message = "Brand is required")
	private String brand;
	@NotBlank(message = "Model is required")
	private String model;
	@NotBlank(message = "Serial number is required")
	private String serialNumber;
	@NotNull(message = "Purchase date is required")
	@PastOrPresent(message = "Purchase date cannot be in the future")
	private LocalDate purchaseDate;
	@Pattern(regexp = "In use|In stock|Repair|Retired", message = "Status must be In use, In stock, Repair or Retired")
	private String status;
	private String assignedTo;
	@NotNull(message = "Price is required")
	@Positive(message = "Price must be greater than 0")
	private Double price;

	public Asset() {
	}

	public Asset(Long id, String assetTag, String brand, String model, String serialNumber,
			LocalDate purchaseDate, String status, String assignedTo, Double price) {
		this.id = id;
		this.assetTag = assetTag;
		this.brand = brand;
		this.model = model;
		this.serialNumber = serialNumber;
		this.purchaseDate = purchaseDate;
		this.status = status;
		this.assignedTo = assignedTo;
		this.price = price;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getAssetTag() {
		return assetTag;
	}

	public void setAssetTag(String assetTag) {
		this.assetTag = assetTag;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}

	public String getSerialNumber() {
		return serialNumber;
	}

	public void setSerialNumber(String serialNumber) {
		this.serialNumber = serialNumber;
	}

	public LocalDate getPurchaseDate() {
		return purchaseDate;
	}

	public void setPurchaseDate(LocalDate purchaseDate) {
		this.purchaseDate = purchaseDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getAssignedTo() {
		return assignedTo;
	}

	public void setAssignedTo(String assignedTo) {
		this.assignedTo = assignedTo;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}
}
